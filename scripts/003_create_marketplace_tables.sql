-- Create suppliers table
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  address text,
  website text,
  logo_url text,
  rating decimal(2,1) default 0.0,
  total_reviews integer default 0,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create material categories table
create table if not exists public.material_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create materials table
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category_id uuid references public.material_categories(id),
  unit text not null, -- e.g., 'piece', 'kg', 'm2', 'm3'
  image_url text,
  specifications jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create supplier materials (pricing) table
create table if not exists public.supplier_materials (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id) on delete cascade,
  material_id uuid references public.materials(id) on delete cascade,
  price decimal(10,2) not null,
  stock_quantity integer default 0,
  minimum_order integer default 1,
  delivery_time_days integer,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(supplier_id, material_id)
);

-- Enable RLS
alter table public.suppliers enable row level security;
alter table public.material_categories enable row level security;
alter table public.materials enable row level security;
alter table public.supplier_materials enable row level security;

-- RLS policies - Allow all authenticated users to read marketplace data
create policy "suppliers_select_all" on public.suppliers for select using (auth.uid() is not null);
create policy "material_categories_select_all" on public.material_categories for select using (auth.uid() is not null);
create policy "materials_select_all" on public.materials for select using (auth.uid() is not null);
create policy "supplier_materials_select_all" on public.supplier_materials for select using (auth.uid() is not null);

-- Allow suppliers to manage their own data
create policy "suppliers_manage_own" on public.suppliers 
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'supplier'
    )
  );

create policy "supplier_materials_manage_own" on public.supplier_materials 
  for all using (
    exists (
      select 1 from public.profiles p
      join public.suppliers s on s.email = p.email
      where p.id = auth.uid() and p.role = 'supplier' and s.id = supplier_id
    )
  );

-- Allow admins to manage all data
create policy "suppliers_admin_manage" on public.suppliers 
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "materials_admin_manage" on public.materials 
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "material_categories_admin_manage" on public.material_categories 
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
