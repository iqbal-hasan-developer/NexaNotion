-- NexaNotion Phase 5 admin catalog, inventory, and storage helpers.
-- Run this after the Phase 3 backend foundation migration.

alter table public.products
  add column if not exists sku text,
  add column if not exists low_stock_threshold integer not null default 5,
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_featured boolean not null default false,
  add column if not exists inventory_tracking boolean not null default true;

alter table public.categories
  alter column sort_order set default 0;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_low_stock_threshold_nonnegative') then
    alter table public.products add constraint products_low_stock_threshold_nonnegative check (low_stock_threshold >= 0) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'products_sort_order_nonnegative') then
    alter table public.products add constraint products_sort_order_nonnegative check (sort_order >= 0) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'categories_sort_order_nonnegative') then
    alter table public.categories add constraint categories_sort_order_nonnegative check (sort_order is null or sort_order >= 0) not valid;
  end if;
end $$;

create index if not exists products_active_sort_idx on public.products (is_active, sort_order, created_at desc);
create index if not exists products_low_stock_idx on public.products (inventory_tracking, stock, low_stock_threshold);
create index if not exists products_sku_idx on public.products (sku);

create or replace function public.decrement_product_stock(product_id uuid, requested_quantity integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if requested_quantity <= 0 then
    return false;
  end if;

  update public.products
  set stock = stock - requested_quantity,
      updated_at = now()
  where id = product_id
    and inventory_tracking = true
    and stock >= requested_quantity;

  return found;
end;
$$;

revoke all on function public.decrement_product_stock(uuid, integer) from public;
