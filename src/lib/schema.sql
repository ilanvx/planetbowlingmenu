-- Create menu_items table if it doesn't exist
create table if not exists menu_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price integer