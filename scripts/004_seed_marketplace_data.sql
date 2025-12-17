-- Insert material categories
insert into public.material_categories (name, description, icon) values
  ('Concrete & Cement', 'Concrete, cement, and related materials', 'building-2'),
  ('Steel & Metal', 'Steel bars, sheets, pipes, and metal components', 'hammer'),
  ('Lumber & Wood', 'Timber, plywood, and wood products', 'tree-pine'),
  ('Electrical', 'Wires, cables, switches, and electrical components', 'zap'),
  ('Plumbing', 'Pipes, fittings, and plumbing supplies', 'droplets'),
  ('Insulation', 'Thermal and acoustic insulation materials', 'shield'),
  ('Roofing', 'Roofing materials, tiles, and accessories', 'home'),
  ('Tools & Equipment', 'Construction tools and equipment', 'wrench');

-- Insert sample suppliers
insert into public.suppliers (name, email, phone, address, website, rating, total_reviews, is_verified) values
  ('BuildMart Supply Co.', 'contact@buildmart.com', '+1-555-0101', '123 Industrial Ave, Construction City', 'www.buildmart.com', 4.5, 127, true),
  ('ProConstruct Materials', 'sales@proconstruct.com', '+1-555-0102', '456 Supply St, Builder Town', 'www.proconstruct.com', 4.2, 89, true),
  ('Quality Building Supplies', 'info@qualitybuilding.com', '+1-555-0103', '789 Material Blvd, Trade District', 'www.qualitybuilding.com', 4.7, 203, true),
  ('Metro Construction Supply', 'orders@metroconstruction.com', '+1-555-0104', '321 Commerce Dr, Industrial Park', 'www.metroconstruction.com', 4.1, 156, true);

-- Insert sample materials
insert into public.materials (name, description, category_id, unit, specifications) values
  ('Portland Cement', 'High-quality Portland cement for general construction', 
   (select id from public.material_categories where name = 'Concrete & Cement'), 'bag', 
   '{"weight": "50kg", "type": "Type I", "compressive_strength": "42.5 MPa"}'),
  
  ('Steel Rebar #4', '12mm diameter steel reinforcement bar', 
   (select id from public.material_categories where name = 'Steel & Metal'), 'piece', 
   '{"diameter": "12mm", "length": "6m", "grade": "Grade 60", "weight": "6.7kg"}'),
  
  ('Pressure Treated Lumber 2x4', 'Pressure treated pine lumber', 
   (select id from public.material_categories where name = 'Lumber & Wood'), 'piece', 
   '{"dimensions": "2x4 inches", "length": "8ft", "treatment": "ACQ", "grade": "Construction"}'),
  
  ('Copper Wire 12 AWG', 'Solid copper electrical wire', 
   (select id from public.material_categories where name = 'Electrical'), 'meter', 
   '{"gauge": "12 AWG", "type": "THHN", "voltage": "600V", "color": "black"}'),
  
  ('PVC Pipe 4 inch', 'Schedule 40 PVC pipe for drainage', 
   (select id from public.material_categories where name = 'Plumbing'), 'piece', 
   '{"diameter": "4 inches", "length": "10ft", "schedule": "40", "material": "PVC"}');

-- Insert supplier pricing
insert into public.supplier_materials (supplier_id, material_id, price, stock_quantity, minimum_order, delivery_time_days) values
  -- Portland Cement pricing
  ((select id from public.suppliers where name = 'BuildMart Supply Co.'), 
   (select id from public.materials where name = 'Portland Cement'), 8.50, 500, 10, 2),
  ((select id from public.suppliers where name = 'ProConstruct Materials'), 
   (select id from public.materials where name = 'Portland Cement'), 8.25, 300, 5, 3),
  ((select id from public.suppliers where name = 'Quality Building Supplies'), 
   (select id from public.materials where name = 'Portland Cement'), 8.75, 750, 20, 1),
  
  -- Steel Rebar pricing
  ((select id from public.suppliers where name = 'BuildMart Supply Co.'), 
   (select id from public.materials where name = 'Steel Rebar #4'), 12.50, 200, 5, 3),
  ((select id from public.suppliers where name = 'Metro Construction Supply'), 
   (select id from public.materials where name = 'Steel Rebar #4'), 11.75, 150, 10, 2),
  ((select id from public.suppliers where name = 'Quality Building Supplies'), 
   (select id from public.materials where name = 'Steel Rebar #4'), 12.25, 300, 5, 2),
  
  -- Lumber pricing
  ((select id from public.suppliers where name = 'ProConstruct Materials'), 
   (select id from public.materials where name = 'Pressure Treated Lumber 2x4'), 6.75, 400, 1, 1),
  ((select id from public.suppliers where name = 'Quality Building Supplies'), 
   (select id from public.materials where name = 'Pressure Treated Lumber 2x4'), 7.25, 600, 1, 1),
  
  -- Copper Wire pricing
  ((select id from public.suppliers where name = 'BuildMart Supply Co.'), 
   (select id from public.materials where name = 'Copper Wire 12 AWG'), 2.50, 1000, 50, 2),
  ((select id from public.suppliers where name = 'Metro Construction Supply'), 
   (select id from public.materials where name = 'Copper Wire 12 AWG'), 2.35, 800, 25, 3),
  
  -- PVC Pipe pricing
  ((select id from public.suppliers where name = 'ProConstruct Materials'), 
   (select id from public.materials where name = 'PVC Pipe 4 inch'), 15.50, 100, 1, 2),
  ((select id from public.suppliers where name = 'Metro Construction Supply'), 
   (select id from public.materials where name = 'PVC Pipe 4 inch'), 14.75, 75, 1, 1);
