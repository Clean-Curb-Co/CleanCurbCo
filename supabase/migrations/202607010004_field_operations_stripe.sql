-- Field operations, service photos, route workflow, and Stripe payment foundation.

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('customer', 'technician', 'admin', 'owner'));

alter table public.profiles
  add column if not exists stripe_customer_id text;

alter table public.bookings
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_subscription_id text;

create or replace function public.is_field_user(user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role in ('technician', 'admin', 'owner')
  );
$$;

create table if not exists public.route_days (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  route_date date not null,
  route_name text,
  service_area text default 'Cane Bay',
  status text not null default 'planned'
    check (status in ('planned', 'active', 'completed', 'cancelled')),
  assigned_technician_id uuid references public.profiles(id) on delete set null,
  notes text
);

create table if not exists public.route_stops (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  route_day_id uuid references public.route_days(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete cascade,
  service_visit_id uuid references public.service_visits(id) on delete cascade,
  stop_order integer not null default 0,
  status text not null default 'scheduled'
    check (status in ('scheduled','on_the_way','arrived','in_progress','completed','skipped','needs_follow_up','rescheduled','cancelled')),
  started_at timestamptz,
  completed_at timestamptz,
  technician_notes text,
  issue_flags text[] default '{}'
);

create table if not exists public.service_checklists (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  service_visit_id uuid references public.service_visits(id) on delete cascade,
  route_stop_id uuid references public.route_stops(id) on delete cascade,
  arrived_at_property boolean not null default false,
  bins_located boolean not null default false,
  before_photos_taken boolean not null default false,
  loose_debris_removed boolean not null default false,
  cleaner_applied boolean not null default false,
  bins_pressure_washed boolean not null default false,
  scrubbed_if_needed boolean not null default false,
  sanitized boolean not null default false,
  deodorized boolean not null default false,
  trash_pad_cleaned boolean not null default false,
  add_ons_completed boolean not null default false,
  after_photos_taken boolean not null default false,
  bins_returned_neatly boolean not null default false,
  work_area_checked boolean not null default false,
  service_completed boolean not null default false,
  completed_by uuid references public.profiles(id) on delete set null,
  completed_at timestamptz
);

create table if not exists public.service_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service_visit_id uuid references public.service_visits(id) on delete cascade,
  route_stop_id uuid references public.route_stops(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete set null,
  photo_type text not null
    check (photo_type in ('before', 'after', 'issue', 'other')),
  storage_bucket text not null default 'service-photos',
  storage_path text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  caption text,
  is_customer_visible boolean not null default true
);

create table if not exists public.route_breaks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  route_day_id uuid references public.route_days(id) on delete cascade,
  technician_id uuid references public.profiles(id) on delete set null,
  reason text not null
    check (reason in ('lunch','bathroom','tank_empty','tank_refill','equipment_issue','fuel_stop','weather_pause','customer_delay','other')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  notes text
);

create table if not exists public.service_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete cascade,
  service_visit_id uuid references public.service_visits(id) on delete cascade,
  route_stop_id uuid references public.route_stops(id) on delete cascade,
  event_type text not null,
  message text not null,
  metadata jsonb default '{}'::jsonb
);

create table if not exists public.notification_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  recipient_profile_id uuid references public.profiles(id) on delete set null,
  recipient_email text,
  recipient_phone text,
  channel text not null
    check (channel in ('email', 'sms', 'manual')),
  template_key text not null,
  status text not null default 'queued'
    check (status in ('queued', 'sent', 'failed', 'skipped')),
  related_booking_id uuid references public.bookings(id) on delete set null,
  related_visit_id uuid references public.service_visits(id) on delete set null,
  related_route_stop_id uuid references public.route_stops(id) on delete set null,
  resend_id text,
  error_message text
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid references public.profiles(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  service_visit_id uuid references public.service_visits(id) on delete set null,
  amount integer not null,
  currency text not null default 'usd',
  status text not null default 'pending'
    check (status in ('not_sent','pending','paid','failed','refunded','cancelled')),
  provider text not null default 'stripe',
  stripe_customer_id text,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  checkout_url text,
  description text
);

do $$
begin
  if exists (select 1 from pg_proc where proname = 'set_updated_at') then
    create trigger set_route_days_updated_at before update on public.route_days
      for each row execute function public.set_updated_at();
    create trigger set_route_stops_updated_at before update on public.route_stops
      for each row execute function public.set_updated_at();
    create trigger set_service_checklists_updated_at before update on public.service_checklists
      for each row execute function public.set_updated_at();
    create trigger set_payments_updated_at before update on public.payments
      for each row execute function public.set_updated_at();
  end if;
exception
  when duplicate_object then null;
end $$;

create index if not exists route_days_route_date_idx on public.route_days(route_date);
create index if not exists route_days_technician_idx on public.route_days(assigned_technician_id);
create index if not exists route_stops_route_day_order_idx on public.route_stops(route_day_id, stop_order);
create index if not exists route_stops_booking_idx on public.route_stops(booking_id);
create index if not exists route_stops_visit_idx on public.route_stops(service_visit_id);
create index if not exists service_photos_visit_idx on public.service_photos(service_visit_id);
create index if not exists service_photos_customer_idx on public.service_photos(customer_id);
create index if not exists route_breaks_route_day_idx on public.route_breaks(route_day_id);
create index if not exists service_events_booking_idx on public.service_events(booking_id);
create index if not exists notification_events_booking_idx on public.notification_events(related_booking_id);
create index if not exists payments_customer_idx on public.payments(customer_id);
create index if not exists payments_booking_idx on public.payments(booking_id);
create index if not exists payments_checkout_session_idx on public.payments(stripe_checkout_session_id);

alter table public.route_days enable row level security;
alter table public.route_stops enable row level security;
alter table public.service_checklists enable row level security;
alter table public.service_photos enable row level security;
alter table public.route_breaks enable row level security;
alter table public.service_events enable row level security;
alter table public.notification_events enable row level security;
alter table public.payments enable row level security;

drop policy if exists "Admins manage route days" on public.route_days;
create policy "Admins manage route days"
  on public.route_days for all
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "Field users read route days" on public.route_days;
create policy "Field users read route days"
  on public.route_days for select
  using (public.is_field_user());

drop policy if exists "Admins manage route stops" on public.route_stops;
create policy "Admins manage route stops"
  on public.route_stops for all
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "Field users manage route stops" on public.route_stops;
create policy "Field users manage route stops"
  on public.route_stops for all
  using (public.is_field_user())
  with check (public.is_field_user());

drop policy if exists "Admins manage service checklists" on public.service_checklists;
create policy "Admins manage service checklists"
  on public.service_checklists for all
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "Field users manage service checklists" on public.service_checklists;
create policy "Field users manage service checklists"
  on public.service_checklists for all
  using (public.is_field_user())
  with check (public.is_field_user());

drop policy if exists "Customers read own checklist summary" on public.service_checklists;
create policy "Customers read own checklist summary"
  on public.service_checklists for select
  using (
    exists (
      select 1
      from public.service_visits sv
      where sv.id = service_checklists.service_visit_id
        and sv.customer_id = auth.uid()
    )
  );

drop policy if exists "Admins manage service photos" on public.service_photos;
create policy "Admins manage service photos"
  on public.service_photos for all
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "Field users manage service photos" on public.service_photos;
create policy "Field users manage service photos"
  on public.service_photos for all
  using (public.is_field_user())
  with check (public.is_field_user());

drop policy if exists "Customers read own visible service photos" on public.service_photos;
create policy "Customers read own visible service photos"
  on public.service_photos for select
  using (customer_id = auth.uid() and is_customer_visible = true);

drop policy if exists "Admins manage route breaks" on public.route_breaks;
create policy "Admins manage route breaks"
  on public.route_breaks for all
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "Technicians manage own route breaks" on public.route_breaks;
create policy "Technicians manage own route breaks"
  on public.route_breaks for all
  using (public.is_field_user() and technician_id = auth.uid())
  with check (public.is_field_user() and technician_id = auth.uid());

drop policy if exists "Admins read service events" on public.service_events;
create policy "Admins read service events"
  on public.service_events for select
  using (public.is_admin_or_owner());

drop policy if exists "Field users create and read service events" on public.service_events;
create policy "Field users create and read service events"
  on public.service_events for all
  using (public.is_field_user())
  with check (public.is_field_user());

drop policy if exists "Admins read notification events" on public.notification_events;
create policy "Admins read notification events"
  on public.notification_events for select
  using (public.is_admin_or_owner());

drop policy if exists "Field users create notification events" on public.notification_events;
create policy "Field users create notification events"
  on public.notification_events for insert
  with check (public.is_field_user());

drop policy if exists "Admins manage payments" on public.payments;
create policy "Admins manage payments"
  on public.payments for all
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "Field users read payments" on public.payments;
create policy "Field users read payments"
  on public.payments for select
  using (public.is_field_user());

drop policy if exists "Customers read own payments" on public.payments;
create policy "Customers read own payments"
  on public.payments for select
  using (customer_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('service-photos', 'service-photos', false)
on conflict (id) do update set public = false;

drop policy if exists "Service photo objects readable by related users" on storage.objects;
create policy "Service photo objects readable by related users"
  on storage.objects for select
  using (
    bucket_id = 'service-photos'
    and (
      public.is_field_user()
      or exists (
        select 1
        from public.service_photos sp
        where sp.storage_bucket = storage.objects.bucket_id
          and sp.storage_path = storage.objects.name
          and sp.customer_id = auth.uid()
          and sp.is_customer_visible = true
      )
    )
  );

drop policy if exists "Field users insert service photo objects" on storage.objects;
create policy "Field users insert service photo objects"
  on storage.objects for insert
  with check (bucket_id = 'service-photos' and public.is_field_user());

drop policy if exists "Field users update service photo objects" on storage.objects;
create policy "Field users update service photo objects"
  on storage.objects for update
  using (bucket_id = 'service-photos' and public.is_field_user())
  with check (bucket_id = 'service-photos' and public.is_field_user());

drop policy if exists "Field users delete service photo objects" on storage.objects;
create policy "Field users delete service photo objects"
  on storage.objects for delete
  using (bucket_id = 'service-photos' and public.is_field_user());
