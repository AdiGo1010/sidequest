-- SideQuest schema. Paste into the Supabase SQL editor or run with the CLI.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'client');
create type public.task_status as enum ('open', 'in_progress', 'completed');
create type public.application_status as enum ('pending', 'hired', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  role public.user_role not null,
  uni text,
  bio text not null default '',
  skills text[] not null default '{}',
  location text not null default 'Sydney',
  verified_badge boolean not null default false,
  rating numeric(3,1) not null default 0,
  review_count int not null default 0,
  completed_tasks int not null default 0,
  total_earnings numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  budget numeric(10,2) not null,
  location text not null,
  deadline date not null,
  status public.task_status not null default 'open',
  client_id uuid not null references public.profiles (id) on delete cascade,
  hired_student_id uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  message text not null default '',
  status public.application_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (task_id, student_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  from_id uuid not null references public.profiles (id) on delete cascade,
  to_id uuid not null references public.profiles (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  daily_rate numeric(10,2) not null,
  available boolean not null default true,
  description text not null default '',
  location text not null
);

create table public.equipment_bookings (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  status text not null default 'booked'
);

create table public.calendar_connections (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  refresh_token text not null,
  connected_at timestamptz not null default now()
);

create table public.quest_suggestions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  category text not null,
  reason text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  task_id uuid references public.tasks (id),
  confirmed boolean not null default false
);

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.applications enable row level security;
alter table public.reviews enable row level security;
alter table public.equipment enable row level security;
alter table public.equipment_bookings enable row level security;
alter table public.calendar_connections enable row level security;
alter table public.quest_suggestions enable row level security;

create policy "users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "tasks readable" on public.tasks for select using (true);
create policy "clients insert tasks" on public.tasks
  for insert with check (auth.uid() = client_id);
create policy "clients update own tasks" on public.tasks
  for update using (auth.uid() = client_id);

create policy "applications readable to parties" on public.applications
  for select using (
    auth.uid() = student_id
    or auth.uid() in (select client_id from public.tasks where id = task_id)
  );
create policy "students apply" on public.applications
  for insert with check (auth.uid() = student_id);
create policy "clients manage applications" on public.applications
  for update using (
    auth.uid() in (select client_id from public.tasks where id = task_id)
  );

create policy "reviews readable" on public.reviews for select using (true);
create policy "parties review" on public.reviews
  for insert with check (auth.uid() = from_id);

create policy "equipment readable" on public.equipment for select using (true);

create policy "own bookings" on public.equipment_bookings
  for select using (auth.uid() = student_id);
create policy "students book" on public.equipment_bookings
  for insert with check (auth.uid() = student_id);

create policy "own calendar" on public.calendar_connections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own suggestions" on public.quest_suggestions
  for all using (auth.uid() = student_id) with check (auth.uid() = student_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, uni, verified_badge, location)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'student'),
    new.raw_user_meta_data->>'uni',
    coalesce((new.raw_user_meta_data->>'role') = 'student', false),
    coalesce(new.raw_user_meta_data->>'location', 'Sydney')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
