import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";

export const metadata: Metadata = {
  title: "Admin Bookings",
};

export default function AdminBookingsPage() {
  return <AdminShell title="Admin bookings" />;
}
