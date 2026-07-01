import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin, type AuthResult } from "@/lib/supabase/auth";
import type {
  BookingRow,
  ContactMessageRow,
  ProfileRow,
  ServiceAddressRow,
  ServiceVisitRow,
} from "@/types/database";

export type AdminContext = {
  auth: AuthResult;
  bookings: BookingRow[];
  contacts: ContactMessageRow[];
  profiles: ProfileRow[];
  addresses: ServiceAddressRow[];
  visits: ServiceVisitRow[];
};

export async function getAdminContext(nextPath = "/admin"): Promise<AdminContext> {
  const auth = await requireAdmin(nextPath);

  if (auth.status !== "ok") {
    return {
      auth,
      bookings: [],
      contacts: [],
      profiles: [],
      addresses: [],
      visits: [],
    };
  }

  const admin = getSupabaseAdmin();
  const [bookingsResult, contactsResult, profilesResult, addressesResult, visitsResult] =
    await Promise.all([
      admin
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false }),
      admin
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false }),
      admin
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      admin
        .from("service_addresses")
        .select("*")
        .order("created_at", { ascending: false }),
      admin
        .from("service_visits")
        .select("*")
        .order("route_day", { ascending: false }),
    ]);

  return {
    auth,
    bookings: bookingsResult.data ?? [],
    contacts: contactsResult.data ?? [],
    profiles: profilesResult.data ?? [],
    addresses: addressesResult.data ?? [],
    visits: visitsResult.data ?? [],
  };
}
