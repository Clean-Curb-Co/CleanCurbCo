import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAuth, type AuthResult } from "@/lib/supabase/auth";
import type { BookingRow, ServiceAddressRow, ServiceVisitRow } from "@/types/database";

export type PortalContext = {
  auth: AuthResult;
  bookings: BookingRow[];
  addresses: ServiceAddressRow[];
  visits: ServiceVisitRow[];
};

export async function getPortalContext(nextPath = "/portal"): Promise<PortalContext> {
  const auth = await requireAuth(nextPath);

  if (auth.status !== "ok") {
    return {
      auth,
      bookings: [],
      addresses: [],
      visits: [],
    };
  }

  const supabase = await createServerSupabaseClient();
  const [bookingsResult, addressesResult, visitsResult] = await Promise.all([
    supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("service_addresses")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("service_visits")
      .select("*")
      .order("route_day", { ascending: false }),
  ]);

  return {
    auth,
    bookings: bookingsResult.data ?? [],
    addresses: addressesResult.data ?? [],
    visits: visitsResult.data ?? [],
  };
}
