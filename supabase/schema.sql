create table profiles (
  id text primary key,
  email text,
  plan_tier text default 'vibe_coder' check (plan_tier in ('vibe_coder', 'developer', 'teams', 'enterprise')),
  scans_remaining integer default 1,
  paddle_customer_id text,
  paddle_subscription_id text,
  subscription_status text default 'inactive',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (true); -- Internal service uses service_role, this is for safety

create policy "Users can update own profile." on profiles
  for update using (auth.uid()::text = id);

-- Create a table for scans
create table scans (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  repo_url text not null,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  score integer,
  summary jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on scans
alter table scans enable row level security;

create policy "Users can view their own scans." on scans
  for select using (auth.uid()::text = user_id);

create policy "Users can insert their own scans." on scans
  for insert with check (auth.uid()::text = user_id);

-- Create a table for issues found in scans
create table issues (
  id uuid default gen_random_uuid() primary key,
  scan_id uuid references scans on delete cascade not null,
  category text check (category in ('security', 'architecture', 'quality', 'tech_debt', 'ai_specific')),
  severity text check (severity in ('critical', 'high', 'medium', 'low')),
  file_path text,
  line_number integer,
  description text,
  fix_suggestion text,
  is_locked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on issues
alter table issues enable row level security;

create policy "Users can view issues from their scans." on issues
  for select using (
    exists (
      select 1 from scans
      where scans.id = issues.scan_id
      and (scans.user_id = auth.uid()::text or auth.role() = 'service_role')
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id::text, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
