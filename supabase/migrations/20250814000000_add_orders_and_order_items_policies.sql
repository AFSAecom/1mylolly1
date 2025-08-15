-- Create orders and order_items tables with RLS policies

-- Tables (if not already created)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  code_client text not null,
  total_amount numeric not null,
  status text not null default 'en_attente' check (status in ('en_attente','confirmee','expediee','livree','annulee')),
  conseillere_id uuid references public.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_variant_id uuid references public.product_variants(id),
  quantity integer not null,
  unit_price numeric not null,
  total_price numeric not null,
  created_at timestamptz default now()
);

-- Row Level Security policies
alter table public.orders enable row level security;
create policy "Users insert own orders"
  on public.orders for insert with check (auth.uid() = user_id);
create policy "Users read own orders"
  on public.orders for select using (auth.uid() = user_id);

alter table public.order_items enable row level security;
create policy "Insert items for own orders"
  on public.order_items for insert
  with check (exists (select 1 from orders where id = order_id and user_id = auth.uid()));
create policy "Read items for own orders"
  on public.order_items for select
  using (exists (select 1 from orders where id = order_id and user_id = auth.uid()));
