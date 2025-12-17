-- Create user inventory table
create table if not exists public.user_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  material_id uuid references public.materials(id) on delete cascade,
  current_stock decimal(10,2) not null default 0,
  minimum_stock decimal(10,2) not null default 0,
  maximum_stock decimal(10,2),
  unit_cost decimal(10,2),
  location text,
  notes text,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, material_id)
);

-- Create inventory movements table for tracking stock changes
create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  user_inventory_id uuid references public.user_inventory(id) on delete cascade,
  movement_type text not null check (movement_type in ('in', 'out', 'adjustment')),
  quantity decimal(10,2) not null,
  unit_cost decimal(10,2),
  reference_type text, -- 'purchase', 'usage', 'waste', 'transfer', 'adjustment'
  reference_id uuid, -- could reference orders, projects, etc.
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create low stock alerts table
create table if not exists public.stock_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_inventory_id uuid references public.user_inventory(id) on delete cascade,
  alert_type text not null check (alert_type in ('low_stock', 'out_of_stock', 'overstock')),
  is_acknowledged boolean default false,
  acknowledged_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_inventory enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.stock_alerts enable row level security;

-- RLS policies - Users can only access their own inventory data
create policy "user_inventory_own" on public.user_inventory 
  for all using (auth.uid() = user_id);

create policy "inventory_movements_own" on public.inventory_movements 
  for all using (
    exists (
      select 1 from public.user_inventory ui
      where ui.id = user_inventory_id and ui.user_id = auth.uid()
    )
  );

create policy "stock_alerts_own" on public.stock_alerts 
  for all using (auth.uid() = user_id);

-- Allow admins to view all inventory data
create policy "user_inventory_admin" on public.user_inventory 
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "inventory_movements_admin" on public.inventory_movements 
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "stock_alerts_admin" on public.stock_alerts 
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
