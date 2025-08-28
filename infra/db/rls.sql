-- ========= Helpers =========
create or replace function public.auth_profile_id()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid;
begin
  -- auth.uid() читает sub из JWT; для anon = null
  select p.id into pid
  from public.profiles p
  where p.auth_user_id = auth.uid()
  limit 1;
  return pid;
end;
$$;

grant execute on function public.auth_profile_id() to anon, authenticated;

-- Автосоздание профиля при появлении пользователя в auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (auth_user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========= Enable RLS =========
alter table public.organizations enable row level security;
alter table public.profiles      enable row level security;
alter table public.memberships   enable row level security;

-- ========= Policies =========

-- profiles: пользователь видит только свой профиль
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select
  on public.profiles
  for select
  using (id = public.auth_profile_id());

-- organizations: видим только те, где есть membership текущего профиля
drop policy if exists orgs_member_select on public.organizations;
create policy orgs_member_select
  on public.organizations
  for select
  using (
    exists (
      select 1
      from public.memberships m
      where m.org_id = organizations.id
        and m.profile_id = public.auth_profile_id()
    )
  );

-- memberships: видим только свои строки membership
drop policy if exists memberships_self_select on public.memberships;
create policy memberships_self_select
  on public.memberships
  for select
  using (profile_id = public.auth_profile_id());

-- (Опционально) Запретить insert/update/delete по умолчанию.
-- Будущие операции добавим через безопасные RPC (SECURITY DEFINER).
revoke insert, update, delete on public.organizations from anon, authenticated;
revoke insert, update, delete on public.profiles      from anon, authenticated;
revoke insert, update, delete on public.memberships   from anon, authenticated;
