-- Create a table for public user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  plan_tier text default 'free' check (plan_tier in ('free', 'starter', 'professional', 'enterprise')),
  scans_remaining integer default 1,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for scans
create table scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  repo_url text not null,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  score integer,
  summary jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on scans
alter table scans enable row level security;

create policy "Users can view their own scans." on scans
  for select using (auth.uid() = user_id);

create policy "Users can insert their own scans." on scans
  for insert with check (auth.uid() = user_id);

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
      and scans.user_id = auth.uid()
    )
  );

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
