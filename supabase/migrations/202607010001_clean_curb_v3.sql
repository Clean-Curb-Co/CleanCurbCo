create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  role text not null default 'customer'
    check (role in ('customer', 'admin', 'owner')),
  first_name text,
  last_name text,
  phone text,
  email text,
  marketing_opt_in boolean not null default false,
  sms_opt_in boolean not null default false,
  preferred_contact_method text default 'email'
    check (preferred_contact_method in ('email', 'phone', 'sms'))
);

create table if not exists public.service_addresses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  label text default 'Home',
  street_address text not null,
  city text not null default 'Summerville',
  state text not null default 'SC',
  zip_code text,
  neighborhood text,
  gate_code text,
  notes text,
  is_primary boolean not null default true
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid references public.profiles(id) on delete set null,
  service_address_id uuid references public.service_addresses(id) on delete set null,
  status text not null default 'new'
    check (status in (
      'new',
      'confirmed',
      'scheduled',
      'in_progress',
      'completed',
      'paid',
      'needs_follow_up',
      'cancelled'
    )),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  street_address text not null,
  city text not null default 'Summerville',
  state text not null default 'SC',
  zip_code text,
  neighborhood text,
  bin_count integer not null default 2,
  bin_types text[] not null default '{}',
  frequency text not null
    check (frequency in ('one_time', 'monthly', 'every_other_month', 'quarterly')),
  add_ons text[] not null default '{}',
  estimated_price integer not null default 0,
  scheduling_preference text not null
    check (scheduling_preference in ('next_available_route_day', 'specific_day', 'urgent')),
  requested_date date,
  confirmed_route_day date,
  bin_location text,
  water_spigot_available text
    check (water_spigot_available in ('yes', 'no', 'not_sure')),
  customer_notes text,
  internal_notes text,
  agreement_water_use boolean not null default false,
  agreement_bin_condition boolean not null default false,
  agreement_wastewater boolean not null default false,
  agreement_weather_access boolean not null default false,
  agreement_photos boolean not null default false,
  agreement_payment boolean not null default false,
  payment_status text not null default 'not_sent'
    check (payment_status in ('not_sent', 'pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  payment_link text,
  payment_provider text,
  payment_reference text
);

create table if not exists public.booking_claims (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  email text not null,
  token_hash text not null,
  used_at timestamptz
);

create table if not exists public.service_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  booking_id uuid references public.bookings(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete set null,
  route_day date,
  arrival_window_start time,
  arrival_window_end time,
  status text not null default 'scheduled'
    check (status in (
      'scheduled',
      'on_the_way',
      'arrived',
      'in_progress',
      'completed',
      'skipped',
      'rescheduled',
      'cancelled'
    )),
  before_photo_urls text[] default '{}',
  after_photo_urls text[] default '{}',
  technician_notes text,
  completed_at timestamptz
);

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  recipient_email text not null,
  subject text not null,
  template_key text not null,
  related_booking_id uuid references public.bookings(id) on delete set null,
  related_visit_id uuid references public.service_visits(id) on delete set null,
  status text not null default 'queued'
    check (status in ('queued', 'sent', 'failed')),
  resend_id text,
  error_message text
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text,
  email text not null,
  address_or_neighborhood text,
  reason text not null,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'closed'))
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_service_addresses_updated_at on public.service_addresses;
create trigger set_service_addresses_updated_at
before update on public.service_addresses
for each row execute function public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists set_service_visits_updated_at on public.service_visits;
create trigger set_service_visits_updated_at
before update on public.service_visits
for each row execute function public.set_updated_at();

create or replace function public.is_admin_or_owner(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role in ('admin', 'owner')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.service_addresses enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_claims enable row level security;
alter table public.service_visits enable row level security;
alter table public.email_events enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Profiles are readable by owner or admin" on public.profiles;
create policy "Profiles are readable by owner or admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin_or_owner());

drop policy if exists "Profiles are updateable by owner or admin" on public.profiles;
create policy "Profiles are updateable by owner or admin"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_admin_or_owner())
with check (id = auth.uid() or public.is_admin_or_owner());

drop policy if exists "Service addresses owned by customer or admin" on public.service_addresses;
create policy "Service addresses owned by customer or admin"
on public.service_addresses for all
to authenticated
using (customer_id = auth.uid() or public.is_admin_or_owner())
with check (customer_id = auth.uid() or public.is_admin_or_owner());

drop policy if exists "Bookings readable by linked customer or admin" on public.bookings;
create policy "Bookings readable by linked customer or admin"
on public.bookings for select
to authenticated
using (customer_id = auth.uid() or public.is_admin_or_owner());

drop policy if exists "Bookings updateable by admin" on public.bookings;
create policy "Bookings updateable by admin"
on public.bookings for update
to authenticated
using (public.is_admin_or_owner())
with check (public.is_admin_or_owner());

drop policy if exists "Booking claims readable by admin only" on public.booking_claims;
create policy "Booking claims readable by admin only"
on public.booking_claims for select
to authenticated
using (public.is_admin_or_owner());

drop policy if exists "Service visits readable by linked customer or admin" on public.service_visits;
create policy "Service visits readable by linked customer or admin"
on public.service_visits for select
to authenticated
using (customer_id = auth.uid() or public.is_admin_or_owner());

drop policy if exists "Service visits managed by admin" on public.service_visits;
create policy "Service visits managed by admin"
on public.service_visits for all
to authenticated
using (public.is_admin_or_owner())
with check (public.is_admin_or_owner());

drop policy if exists "Email events admin only" on public.email_events;
create policy "Email events admin only"
on public.email_events for all
to authenticated
using (public.is_admin_or_owner())
with check (public.is_admin_or_owner());

drop policy if exists "Contact messages admin only" on public.contact_messages;
create policy "Contact messages admin only"
on public.contact_messages for all
to authenticated
using (public.is_admin_or_owner())
with check (public.is_admin_or_owner());

create index if not exists bookings_customer_id_idx on public.bookings(customer_id);
create index if not exists bookings_status_idx on public.bookings(status);
create index if not exists bookings_neighborhood_idx on public.bookings(neighborhood);
create index if not exists bookings_frequency_idx on public.bookings(frequency);
create index if not exists booking_claims_booking_id_idx on public.booking_claims(booking_id);
create index if not exists booking_claims_token_hash_idx on public.booking_claims(token_hash);
create index if not exists service_visits_customer_id_idx on public.service_visits(customer_id);
create index if not exists contact_messages_status_idx on public.contact_messages(status);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.service_addresses to authenticated;
grant select, update on public.bookings to authenticated;
grant select on public.booking_claims to authenticated;
grant select, insert, update, delete on public.service_visits to authenticated;
grant select, insert, update, delete on public.email_events to authenticated;
grant select, insert, update, delete on public.contact_messages to authenticated;
