-- Function to automatically create stock alerts
create or replace function public.check_stock_levels()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Delete existing alerts for this inventory item
  delete from public.stock_alerts 
  where user_inventory_id = NEW.id and alert_type in ('low_stock', 'out_of_stock');
  
  -- Check for out of stock
  if NEW.current_stock <= 0 then
    insert into public.stock_alerts (user_id, user_inventory_id, alert_type)
    values (NEW.user_id, NEW.id, 'out_of_stock');
  -- Check for low stock
  elsif NEW.current_stock <= NEW.minimum_stock and NEW.minimum_stock > 0 then
    insert into public.stock_alerts (user_id, user_inventory_id, alert_type)
    values (NEW.user_id, NEW.id, 'low_stock');
  end if;
  
  return NEW;
end;
$$;

-- Trigger to check stock levels after inventory updates
drop trigger if exists check_stock_levels_trigger on public.user_inventory;
create trigger check_stock_levels_trigger
  after insert or update of current_stock, minimum_stock
  on public.user_inventory
  for each row
  execute function public.check_stock_levels();

-- Function to update inventory from movements
create or replace function public.update_inventory_from_movement()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Update current stock based on movement type
  if NEW.movement_type = 'in' then
    update public.user_inventory 
    set current_stock = current_stock + NEW.quantity,
        last_updated = now()
    where id = NEW.user_inventory_id;
  elsif NEW.movement_type = 'out' then
    update public.user_inventory 
    set current_stock = current_stock - NEW.quantity,
        last_updated = now()
    where id = NEW.user_inventory_id;
  elsif NEW.movement_type = 'adjustment' then
    update public.user_inventory 
    set current_stock = NEW.quantity,
        last_updated = now()
    where id = NEW.user_inventory_id;
  end if;
  
  return NEW;
end;
$$;

-- Trigger to update inventory when movements are added
drop trigger if exists update_inventory_trigger on public.inventory_movements;
create trigger update_inventory_trigger
  after insert on public.inventory_movements
  for each row
  execute function public.update_inventory_from_movement();
