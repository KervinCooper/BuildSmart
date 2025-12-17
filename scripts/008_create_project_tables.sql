-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text not null check (status in ('planning', 'active', 'on_hold', 'completed', 'cancelled')) default 'planning',
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  start_date date,
  end_date date,
  estimated_budget decimal(12,2),
  actual_cost decimal(12,2) default 0,
  client_name text,
  client_email text,
  client_phone text,
  location text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create project tasks table
create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  description text,
  status text not null check (status in ('todo', 'in_progress', 'completed', 'blocked')) default 'todo',
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  assigned_to uuid references auth.users(id),
  start_date date,
  due_date date,
  estimated_hours decimal(5,2),
  actual_hours decimal(5,2) default 0,
  completion_percentage integer default 0 check (completion_percentage >= 0 and completion_percentage <= 100),
  dependencies text[], -- Array of task IDs that must be completed first
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create project materials table (materials assigned to projects)
create table if not exists public.project_materials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  material_id uuid references public.materials(id) on delete cascade,
  task_id uuid references public.project_tasks(id) on delete set null,
  quantity_needed decimal(10,2) not null,
  quantity_allocated decimal(10,2) default 0,
  quantity_used decimal(10,2) default 0,
  estimated_cost decimal(10,2),
  actual_cost decimal(10,2) default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, material_id, task_id)
);

-- Create project timeline/milestones table
create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  description text,
  due_date date not null,
  completed_date date,
  status text not null check (status in ('pending', 'completed', 'overdue')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;
alter table public.project_tasks enable row level security;
alter table public.project_materials enable row level security;
alter table public.project_milestones enable row level security;

-- RLS policies - Users can only access their own projects
create policy "projects_own" on public.projects 
  for all using (auth.uid() = user_id);

create policy "project_tasks_own" on public.project_tasks 
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  );

create policy "project_materials_own" on public.project_materials 
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  );

create policy "project_milestones_own" on public.project_milestones 
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  );

-- Allow admins to view all projects
create policy "projects_admin" on public.projects 
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "project_tasks_admin" on public.project_tasks 
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "project_materials_admin" on public.project_materials 
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "project_milestones_admin" on public.project_milestones 
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
