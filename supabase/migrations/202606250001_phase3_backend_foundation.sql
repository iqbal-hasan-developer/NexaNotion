-- NexaNotion Phase 3 backend foundation.
-- Public visitors can read active categories/products through RLS.
-- Orders, order items, and contact messages are written through server API routes
-- using SUPABASE_SERVICE_ROLE_KEY only. Do not expose the service role key client-side.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id),
  name text not null,
  slug text unique not null,
  short_description text,
  description text,
  price numeric not null,
  compare_at_price numeric,
  image_url text,
  gallery_urls text[] default '{}',
  stock integer default 0,
  is_active boolean default true,
  is_best_seller boolean default false,
  is_new boolean default false,
  is_offer boolean default false,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint products_price_nonnegative check (price >= 0),
  constraint products_compare_at_price_nonnegative check (compare_at_price is null or compare_at_price >= 0),
  constraint products_stock_nonnegative check (stock >= 0)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  delivery_area text not null,
  customer_note text,
  payment_method text not null,
  payment_status text not null default 'unpaid',
  order_status text not null default 'pending',
  subtotal numeric not null,
  delivery_charge numeric not null default 80,
  total numeric not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint orders_payment_method_allowed check (payment_method in ('cod', 'bkash', 'nagad')),
  constraint orders_payment_status_allowed check (payment_status in ('unpaid', 'pending', 'verified', 'failed', 'refunded')),
  constraint orders_order_status_allowed check (order_status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  constraint orders_subtotal_nonnegative check (subtotal >= 0),
  constraint orders_delivery_charge_nonnegative check (delivery_charge >= 0),
  constraint orders_total_nonnegative check (total >= 0)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  product_slug text not null,
  product_image_url text,
  unit_price numeric not null,
  quantity integer not null,
  line_total numeric not null,
  created_at timestamptz default now(),
  constraint order_items_quantity_positive check (quantity > 0),
  constraint order_items_unit_price_nonnegative check (unit_price >= 0),
  constraint order_items_line_total_nonnegative check (line_total >= 0)
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  subject text,
  message text not null,
  status text default 'new',
  created_at timestamptz default now(),
  constraint contact_messages_status_allowed check (status in ('new', 'read', 'replied', 'archived'))
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create index if not exists categories_active_sort_idx on public.categories (is_active, sort_order, name);
create index if not exists products_active_category_idx on public.products (is_active, category_id);
create index if not exists products_slug_idx on public.products (slug);
create index if not exists orders_lookup_idx on public.orders (order_number, customer_phone);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_product_id_idx on public.order_items (product_id);
create index if not exists contact_messages_status_created_idx on public.contact_messages (status, created_at desc);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (is_active = true);

-- No public insert/update/delete policies are defined for orders, order_items,
-- contact_messages, products, or categories. Server API routes use the service
-- role key, which bypasses RLS, after validating and sanitizing customer input.
