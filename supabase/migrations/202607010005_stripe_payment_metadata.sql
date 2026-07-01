alter table public.payments
  add column if not exists payment_type text,
  add column if not exists metadata jsonb default '{}'::jsonb;

create index if not exists payments_payment_type_idx on public.payments(payment_type);
