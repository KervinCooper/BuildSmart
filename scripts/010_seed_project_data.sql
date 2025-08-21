-- Insert sample projects for demo
insert into public.projects (
  user_id, 
  name, 
  description, 
  status, 
  priority, 
  start_date, 
  end_date, 
  estimated_budget, 
  client_name, 
  client_email, 
  location
) 
select 
  (select id from auth.users limit 1),
  'Residential Foundation',
  'Pour concrete foundation for new 2-story residential home',
  'active',
  'high',
  current_date,
  current_date + interval '14 days',
  15000.00,
  'John Smith',
  'john.smith@email.com',
  '123 Oak Street, Construction City'
where exists (select 1 from auth.users limit 1)
on conflict do nothing;

insert into public.projects (
  user_id, 
  name, 
  description, 
  status, 
  priority, 
  start_date, 
  end_date, 
  estimated_budget, 
  client_name, 
  client_email, 
  location
) 
select 
  (select id from auth.users limit 1),
  'Office Building Renovation',
  'Complete renovation of 3rd floor office space',
  'planning',
  'medium',
  current_date + interval '7 days',
  current_date + interval '45 days',
  35000.00,
  'ABC Corporation',
  'facilities@abccorp.com',
  '456 Business Ave, Downtown'
where exists (select 1 from auth.users limit 1)
on conflict do nothing;

insert into public.projects (
  user_id, 
  name, 
  description, 
  status, 
  priority, 
  start_date, 
  end_date, 
  estimated_budget, 
  client_name, 
  client_email, 
  location
) 
select 
  (select id from auth.users limit 1),
  'Warehouse Expansion',
  'Add 2000 sq ft storage area to existing warehouse',
  'completed',
  'low',
  current_date - interval '30 days',
  current_date - interval '5 days',
  22000.00,
  'Storage Solutions Inc',
  'projects@storagesolutions.com',
  '789 Industrial Blvd, Warehouse District'
where exists (select 1 from auth.users limit 1)
on conflict do nothing;

-- Insert sample tasks for the active project
insert into public.project_tasks (
  project_id,
  name,
  description,
  status,
  priority,
  start_date,
  due_date,
  estimated_hours,
  completion_percentage
)
select 
  p.id,
  'Site Preparation',
  'Clear and level the construction site',
  'completed',
  'high',
  current_date - interval '2 days',
  current_date - interval '1 day',
  16.0,
  100
from public.projects p
where p.name = 'Residential Foundation'
and exists (select 1 from auth.users where id = p.user_id);

insert into public.project_tasks (
  project_id,
  name,
  description,
  status,
  priority,
  start_date,
  due_date,
  estimated_hours,
  completion_percentage
)
select 
  p.id,
  'Excavation',
  'Dig foundation trenches to specified depth',
  'in_progress',
  'high',
  current_date - interval '1 day',
  current_date + interval '1 day',
  24.0,
  60
from public.projects p
where p.name = 'Residential Foundation'
and exists (select 1 from auth.users where id = p.user_id);

insert into public.project_tasks (
  project_id,
  name,
  description,
  status,
  priority,
  start_date,
  due_date,
  estimated_hours,
  completion_percentage
)
select 
  p.id,
  'Rebar Installation',
  'Install steel reinforcement bars',
  'todo',
  'high',
  current_date + interval '2 days',
  current_date + interval '4 days',
  20.0,
  0
from public.projects p
where p.name = 'Residential Foundation'
and exists (select 1 from auth.users where id = p.user_id);

insert into public.project_tasks (
  project_id,
  name,
  description,
  status,
  priority,
  start_date,
  due_date,
  estimated_hours,
  completion_percentage
)
select 
  p.id,
  'Concrete Pour',
  'Pour and level concrete foundation',
  'todo',
  'high',
  current_date + interval '5 days',
  current_date + interval '6 days',
  12.0,
  0
from public.projects p
where p.name = 'Residential Foundation'
and exists (select 1 from auth.users where id = p.user_id);

-- Insert sample project materials
insert into public.project_materials (
  project_id,
  material_id,
  quantity_needed,
  quantity_allocated,
  estimated_cost
)
select 
  p.id,
  m.id,
  50.0,
  45.0,
  425.00
from public.projects p
cross join public.materials m
where p.name = 'Residential Foundation'
and m.name = 'Portland Cement'
and exists (select 1 from auth.users where id = p.user_id);

insert into public.project_materials (
  project_id,
  material_id,
  quantity_needed,
  quantity_allocated,
  estimated_cost
)
select 
  p.id,
  m.id,
  25.0,
  20.0,
  306.25
from public.projects p
cross join public.materials m
where p.name = 'Residential Foundation'
and m.name = 'Steel Rebar #4'
and exists (select 1 from auth.users where id = p.user_id);

-- Insert sample milestones
insert into public.project_milestones (
  project_id,
  name,
  description,
  due_date,
  status
)
select 
  p.id,
  'Foundation Complete',
  'Foundation poured and cured',
  current_date + interval '7 days',
  'pending'
from public.projects p
where p.name = 'Residential Foundation'
and exists (select 1 from auth.users where id = p.user_id);

insert into public.project_milestones (
  project_id,
  name,
  description,
  due_date,
  status
)
select 
  p.id,
  'Site Inspection',
  'Building inspector approval',
  current_date + interval '10 days',
  'pending'
from public.projects p
where p.name = 'Residential Foundation'
and exists (select 1 from auth.users where id = p.user_id);
