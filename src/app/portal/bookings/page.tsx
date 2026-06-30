import type { Metadata } from "next";
import { PortalShell } from "@/components/shells/portal-shell";

export const metadata: Metadata = {
  title: "Portal Bookings",
};

export default function PortalBookingsPage() {
  return <PortalShell title="Portal bookings" />;
}
