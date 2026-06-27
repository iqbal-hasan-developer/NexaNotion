-- Store customer-submitted manual bKash/Nagad payment references.
-- These fields are nullable because Cash on Delivery orders do not need them.

alter table public.orders
  add column if not exists payment_transaction_id text,
  add column if not exists payment_number text;

comment on column public.orders.payment_transaction_id is 'Customer-entered manual bKash/Nagad transaction ID for admin verification.';
comment on column public.orders.payment_number is 'Manual payment number shown to the customer at checkout.';

create index if not exists orders_manual_payment_status_idx
  on public.orders (payment_method, payment_status)
  where payment_transaction_id is not null;
