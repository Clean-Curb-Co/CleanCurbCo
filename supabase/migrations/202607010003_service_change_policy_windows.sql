alter table public.bookings
add column if not exists last_customer_change_request_at timestamptz,
add column if not exists cancellation_policy_status text
  check (cancellation_policy_status in (
    'none',
    'fee_may_apply',
    'full_charge_may_apply'
  ));

alter table public.customer_requests
add column if not exists policy_window text not null default 'standard',
add column if not exists policy_acknowledged boolean not null default false,
add column if not exists policy_acknowledged_at timestamptz,
add column if not exists policy_acknowledged_name text,
add column if not exists original_estimated_price integer,
add column if not exists cancellation_fee integer,
add column if not exists full_charge_applies boolean not null default false,
add column if not exists requested_route_day date,
add column if not exists requested_add_ons text[] default '{}',
add column if not exists requested_removed_add_ons text[] default '{}';

alter table public.customer_requests
drop constraint if exists customer_requests_request_type_check,
drop constraint if exists customer_requests_policy_window_check;

alter table public.customer_requests
add constraint customer_requests_request_type_check
check (request_type in (
  'pause_service',
  'cancel_service',
  'reschedule_service',
  'change_frequency',
  'update_address',
  'add_service',
  'drop_service',
  'request_add_on',
  'billing_question',
  'general_help'
));

alter table public.customer_requests
add constraint customer_requests_policy_window_check
check (policy_window in (
  'standard',
  'within_48_hours',
  'within_24_hours'
));

drop policy if exists "Customer requests readable by owner or admin" on public.customer_requests;
create policy "Customer requests readable by owner or admin"
on public.customer_requests for select
to authenticated
using (customer_id = auth.uid() or public.is_admin_or_owner());

drop policy if exists "Customer requests insertable by owner or admin" on public.customer_requests;
create policy "Customer requests insertable by owner or admin"
on public.customer_requests for insert
to authenticated
with check (customer_id = auth.uid() or public.is_admin_or_owner());

drop policy if exists "Customer requests managed by admin" on public.customer_requests;
create policy "Customer requests managed by admin"
on public.customer_requests for update
to authenticated
using (public.is_admin_or_owner())
with check (public.is_admin_or_owner());

create index if not exists customer_requests_policy_window_idx on public.customer_requests(policy_window);
create index if not exists customer_requests_acknowledged_idx on public.customer_requests(policy_acknowledged);
create index if not exists customer_requests_requested_route_day_idx on public.customer_requests(requested_route_day);
create index if not exists bookings_cancellation_policy_status_idx on public.bookings(cancellation_policy_status);
