-- Function to update project actual cost when materials are used
create or replace function public.update_project_cost()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Update project actual cost based on material usage
  update public.projects 
  set actual_cost = (
    select coalesce(sum(actual_cost), 0)
    from public.project_materials
    where project_id = NEW.project_id
  ),
  updated_at = now()
  where id = NEW.project_id;
  
  return NEW;
end;
$$;

-- Trigger to update project cost when materials are updated
drop trigger if exists update_project_cost_trigger on public.project_materials;
create trigger update_project_cost_trigger
  after insert or update of actual_cost
  on public.project_materials
  for each row
  execute function public.update_project_cost();

-- Function to update project status based on task completion
create or replace function public.update_project_status()
returns trigger
language plpgsql
security definer
as $$
declare
  total_tasks integer;
  completed_tasks integer;
  project_status text;
begin
  -- Count total and completed tasks for the project
  select count(*), count(case when status = 'completed' then 1 end)
  into total_tasks, completed_tasks
  from public.project_tasks
  where project_id = NEW.project_id;
  
  -- Determine project status
  if total_tasks = 0 then
    project_status := 'planning';
  elsif completed_tasks = total_tasks then
    project_status := 'completed';
  elsif completed_tasks > 0 then
    project_status := 'active';
  else
    project_status := 'planning';
  end if;
  
  -- Update project status
  update public.projects 
  set status = project_status,
      updated_at = now()
  where id = NEW.project_id;
  
  return NEW;
end;
$$;

-- Trigger to update project status when tasks are updated
drop trigger if exists update_project_status_trigger on public.project_tasks;
create trigger update_project_status_trigger
  after insert or update of status
  on public.project_tasks
  for each row
  execute function public.update_project_status();
