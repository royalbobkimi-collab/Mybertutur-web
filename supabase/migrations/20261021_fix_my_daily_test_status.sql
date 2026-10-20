-- Fix column reference ambiguity in my_daily_test_status
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

revoke all on function public.my_daily_test_status() from public, anon;
grant execute on function public.my_daily_test_status() to authenticated;
