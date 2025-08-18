-- Function called by trigger to decrement stock
create or replace function public.trg_decrement_stock()
returns trigger as $$
begin
  update product_variants
    set stock_actuel = stock_actuel - new.quantity
  where id = new.product_variant_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to decrement stock after inserting order items
drop trigger if exists trg_decrement_stock on public.order_items;
create trigger trg_decrement_stock
  after insert on public.order_items
  for each row execute function public.trg_decrement_stock();
