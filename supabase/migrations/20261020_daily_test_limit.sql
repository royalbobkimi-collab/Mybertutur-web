-- ============================================================================
-- MyBertutur — Daily test limit (1 UBBM + 1 UBBI per user per Malaysia day)
-- ============================================================================
-- WHAT THIS CHANGES (safe, additive only — no drops, no resets):
--   1. New table `public.daily_test_completions` tracking ONE row per
--      (user_id, subject, kl_date). The UNIQUE primary key makes concurrent
--      double-submits impossible: only one insert can win per subject/day.
--   2. RLS enabled: users can SELECT + INSERT their own rows only.
--      NO UPDATE / NO DELETE policies => users cannot modify or reset records.
--   3. SECURITY DEFINER RPC `claim_daily_test(p_subject, p_submission_id)`:
--      - identity comes from `auth.uid()` (never trusts browser user_id)
--      - date comes from the DATABASE clock in Asia/Kuala_Lumpur
--        `(now() AT TIME ZONE 'Asia/Kuala_Lumpur')::date`
--      - atomic single INSERT; duplicate => SQLSTATE 23505 (limit reached)
--   4. RPC `my_daily_test_status()` returns today's KL date + which subjects
--      are already completed, computed server-side.
--
-- APPLY (staging first, needs Supabase access):
--   cd mybertutur-web
--   npx supabase db push --linked   (or apply this file via Dashboard > SQL)
-- ROLLBACK: drop functions/table (rows are audit records; prefer to keep).
-- ============================================================================

begin;

create table if not exists public.daily_test_completions (
  user_id       uuid not null references auth.users (id) on delete cascade,
  subject       text not null check (subject in ('bm', 'bi')),
  kl_date       date not null,
  submission_id bigint null,
  created_at    timestamptz not null default now(),
  primary key (user_id, subject, kl_date)
);

create index if not exists daily_test_completions_user_date_idx
  on public.daily_test_completions (user_id, kl_date);

alter table public.daily_test_completions enable row level security;

drop policy if exists "daily_completions_select_own" on public.daily_test_completions;
create policy "daily_completions_select_own"
  on public.daily_test_completions for select
  using (auth.uid() = user_id);

drop policy if exists "daily_completions_insert_own" on public.daily_test_completions;
create policy "daily_completions_insert_own"
  on public.daily_test_completions for insert
  with check (auth.uid() = user_id);

-- No UPDATE / DELETE policies: records are immutable by users.

-- Atomic claim: one row per (user, subject, KL-day). Returns TRUE when this
-- call created the row, FALSE when the user already completed it today.
create or replace function public.claim_daily_test(p_subject text, p_submission_id bigint default null)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kl_date date := (now() at time zone 'Asia/Kuala_Lumpur')::date;
begin
  if p_subject not in ('bm', 'bi') then
    raise exception 'invalid subject: %', p_subject using errcode = '22000';
  end if;
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  begin
    insert into public.daily_test_completions (user_id, subject, kl_date, submission_id)
    values (auth.uid(), p_subject, v_kl_date, p_submission_id);
    return true;
  exception when unique_violation then
    return false;
  end;
end;
$$;

-- Server-side status: today's KL date + completed flags for the caller.
create or replace function public.my_daily_test_status()
returns table (kl_date date, bm_done boolean, bi_done boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kl_date date := (now() at time zone 'Asia/Kuala_Lumpur')::date;
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  return query
    select
      v_kl_date,
      exists(select 1 from public.daily_test_completions
             where user_id = auth.uid() and subject = 'bm' and kl_date = v_kl_date),
      exists(select 1 from public.daily_test_completions
             where user_id = auth.uid() and subject = 'bi' and kl_date = v_kl_date);
end;
$$;

revoke all on table public.daily_test_completions from anon;
grant select, insert on table public.daily_test_completions to authenticated;

revoke all on function public.claim_daily_test(text, bigint) from public, anon;
grant execute on function public.claim_daily_test(text, bigint) to authenticated;

revoke all on function public.my_daily_test_status() from public, anon;
grant execute on function public.my_daily_test_status() to authenticated;

commit;
