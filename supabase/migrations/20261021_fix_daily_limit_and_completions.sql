-- ============================================================================
-- Fix daily_test_completions and RPCs
-- 1. Ensure submission_id column accepts text/uuid without bigint cast error
-- 2. Fix ambiguous column reference "kl_date" in my_daily_test_status
-- 3. Update claim_daily_test parameter type to text
-- ============================================================================

begin;

-- 1. Alter submission_id type if daily_test_completions already exists
do $$
begin
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
      and table_name = 'daily_test_completions' 
      and column_name = 'submission_id'
  ) then
    alter table public.daily_test_completions drop constraint if exists daily_test_completions_submission_id_fkey;
    alter table public.daily_test_completions alter column submission_id type text using submission_id::text;
  end if;
end $$;

-- 2. Ensure table exists with text submission_id
create table if not exists public.daily_test_completions (
  user_id       uuid not null references auth.users (id) on delete cascade,
  subject       text not null check (subject in ('bm', 'bi')),
  kl_date       date not null,
  submission_id text,
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

-- 3. Atomic claim with text submission_id (prevents bigint syntax errors)
create or replace function public.claim_daily_test(p_subject text, p_submission_id text default null)
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

-- 4. Server-side status without ambiguous kl_date reference
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
      exists(select 1 from public.daily_test_completions dtc
             where dtc.user_id = auth.uid() and dtc.subject = 'bm' and dtc.kl_date = v_kl_date),
      exists(select 1 from public.daily_test_completions dtc
             where dtc.user_id = auth.uid() and dtc.subject = 'bi' and dtc.kl_date = v_kl_date);
end;
$$;

revoke all on table public.daily_test_completions from anon;
grant select, insert on table public.daily_test_completions to authenticated;

revoke all on function public.claim_daily_test(text, text) from public, anon;
grant execute on function public.claim_daily_test(text, text) to authenticated;

revoke all on function public.my_daily_test_status() from public, anon;
grant execute on function public.my_daily_test_status() to authenticated;

commit;
