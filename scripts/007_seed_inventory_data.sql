-- Insert sample inventory data for demo user
-- Note: This assumes a user exists - in real usage, inventory is created when users add materials

-- First, let's create some sample inventory entries
-- (In production, these would be created when users add materials to their inventory)

-- Sample inventory for Portland Cement
insert into public.user_inventory (
  user_id, 
  material_id, 
  current_stock, 
  minimum_stock, 
  maximum_stock, 
  unit_cost, 
  location, 
  notes
) 
select 
  (select id from auth.users limit 1), -- Get first user for demo
  (select id from public.materials where name = 'Portland Cement'),
  45.0,
  20.0,
  100.0,
  8.50,
  'Warehouse A - Section 1',
  'Bulk storage area, keep dry'
where exists (select 1 from auth.users limit 1)
on conflict (user_id, material_id) do nothing;

-- Sample inventory for Steel Rebar
insert into public.user_inventory (
  user_id, 
  material_id, 
  current_stock, 
  minimum_stock, 
  maximum_stock, 
  unit_cost, 
  location, 
  notes
) 
select 
  (select id from auth.users limit 1),
  (select id from public.materials where name = 'Steel Rebar #4'),
  8.0,
  10.0,
  50.0,
  12.25,
  'Yard Storage - Bay 3',
  'Covered storage, check for rust'
where exists (select 1 from auth.users limit 1)
on conflict (user_id, material_id) do nothing;

-- Sample inventory for Lumber
insert into public.user_inventory (
  user_id, 
  material_id, 
  current_stock, 
  minimum_stock, 
  maximum_stock, 
  unit_cost, 
  location, 
  notes
) 
select 
  (select id from auth.users limit 1),
  (select id from public.materials where name = 'Pressure Treated Lumber 2x4'),
  25.0,
  15.0,
  75.0,
  6.75,
  'Lumber Shed - Rack B',
  'Keep elevated and dry'
where exists (select 1 from auth.users limit 1)
on conflict (user_id, material_id) do nothing;

-- Add some sample inventory movements
insert into public.inventory_movements (
  user_inventory_id,
  movement_type,
  quantity,
  unit_cost,
  reference_type,
  notes,
  created_by
)
select 
  ui.id,
  'in',
  50.0,
  8.50,
  'purchase',
  'Initial stock purchase from BuildMart Supply Co.',
  ui.user_id
from public.user_inventory ui
join public.materials m on m.id = ui.material_id
where m.name = 'Portland Cement'
and exists (select 1 from auth.users where id = ui.user_id);

insert into public.inventory_movements (
  user_inventory_id,
  movement_type,
  quantity,
  unit_cost,
  reference_type,
  notes,
  created_by
)
select 
  ui.id,
  'out',
  5.0,
  8.50,
  'usage',
  'Used for foundation work - Project Alpha',
  ui.user_id
from public.user_inventory ui
join public.materials m on m.id = ui.material_id
where m.name = 'Portland Cement'
and exists (select 1 from auth.users where id = ui.user_id);
