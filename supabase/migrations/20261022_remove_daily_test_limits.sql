-- ============================================================================
-- Migration: 20261022_remove_daily_test_limits.sql
-- Remove daily test quota restrictions completely for MyBertutur.
-- Both BM (UBBM) and BI (UBBI) tests are now unlimited every day.
-- Preserves existing daily_test_completions history and table structure.
-- ============================================================================

begin;

-- 1. Remove the (user_id, subject, kl_date) unique primary key constraint
--    so multiple completions per day can exist without conflict.
alter table public.daily_test_completions
  drop constraint if exists daily_test_completions_pkey;

-- 2. Add surrogate primary key id column if not already present
alter table public.daily_test_completions
  add column if not exists id bigint generated always as identity primary key;

-- 3. Ensure lookup index exists for user history queries
create index if not exists daily_test_completions_user_date_idx
  on public.daily_test_completions (user_id, kl_date);

-- 4. Update claim_daily_test(text, bigint) to record without enforcing a 1-test/day limit
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

  -- Record completion for historical telemetry; unlimited tests allowed
  insert into public.daily_test_completions (user_id, subject, kl_date, submission_id)
  values (auth.uid(), p_subject, v_kl_date, p_submission_id);

  return true;
exception when others then
  -- Fail-open / unlimited: never block user from completing tests
  return true;
end;
$$;

-- 5. Overload claim_daily_test(text, text) for clients passing text submission_ids
create or replace function public.claim_daily_test(p_subject text, p_submission_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kl_date date := (now() at time zone 'Asia/Kuala_Lumpur')::date;
  v_sub_id bigint := null;
begin
  if p_subject not in ('bm', 'bi') then
    raise exception 'invalid subject: %', p_subject using errcode = '22000';
  end if;
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  if p_submission_id is not null and p_submission_id ~ '^[0-9]+$' then
    v_sub_id := p_submission_id::bigint;
  end if;

  insert into public.daily_test_completions (user_id, subject, kl_date, submission_id)
  values (auth.uid(), p_subject, v_kl_date, v_sub_id);

  return true;
exception when others then
  -- Fail-open / unlimited: never block user from completing tests
  return true;
end;
$$;

-- 6. Update my_daily_test_status() to always return bm_done=false, bi_done=false
--    so no client ever blocks test start or displays "had harian dicapai"
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

  -- Unlimited practice: both tests are always unlocked
  return query select v_kl_date, false, false;
end;
$$;

-- 7. Grant execute permissions to authenticated users
revoke all on function public.claim_daily_test(text, bigint) from public, anon;
grant execute on function public.claim_daily_test(text, bigint) to authenticated;

revoke all on function public.claim_daily_test(text, text) from public, anon;
grant execute on function public.claim_daily_test(text, text) to authenticated;

revoke all on function public.my_daily_test_status() from public, anon;
grant execute on function public.my_daily_test_status() to authenticated;

commit;
