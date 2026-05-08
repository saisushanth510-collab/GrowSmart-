
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "view own profile" on public.profiles for select using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

-- auto profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated before update on public.profiles
for each row execute procedure public.set_updated_at();

-- user_plants
create table public.user_plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  species text,
  location text,
  notes text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.user_plants enable row level security;
create policy "own plants select" on public.user_plants for select using (auth.uid() = user_id);
create policy "own plants insert" on public.user_plants for insert with check (auth.uid() = user_id);
create policy "own plants update" on public.user_plants for update using (auth.uid() = user_id);
create policy "own plants delete" on public.user_plants for delete using (auth.uid() = user_id);
create trigger user_plants_updated before update on public.user_plants
for each row execute procedure public.set_updated_at();

-- growth_logs
create table public.growth_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid not null references public.user_plants(id) on delete cascade,
  note text,
  image_url text,
  created_at timestamptz not null default now()
);
alter table public.growth_logs enable row level security;
create policy "own logs select" on public.growth_logs for select using (auth.uid() = user_id);
create policy "own logs insert" on public.growth_logs for insert with check (auth.uid() = user_id);
create policy "own logs delete" on public.growth_logs for delete using (auth.uid() = user_id);

-- disease_scans
create table public.disease_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text,
  disease_name text,
  confidence numeric,
  is_healthy boolean default false,
  symptoms text,
  treatment text,
  prevention text,
  raw jsonb,
  created_at timestamptz not null default now()
);
alter table public.disease_scans enable row level security;
create policy "own scans select" on public.disease_scans for select using (auth.uid() = user_id);
create policy "own scans insert" on public.disease_scans for insert with check (auth.uid() = user_id);
create policy "own scans delete" on public.disease_scans for delete using (auth.uid() = user_id);

-- chat_messages
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.chat_messages enable row level security;
create policy "own chat select" on public.chat_messages for select using (auth.uid() = user_id);
create policy "own chat insert" on public.chat_messages for insert with check (auth.uid() = user_id);
create policy "own chat delete" on public.chat_messages for delete using (auth.uid() = user_id);
