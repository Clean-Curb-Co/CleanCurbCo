import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";

export const metadata: Metadata = {
  title: "Admin Services",
};

export default function AdminServicesPage() {
  return <AdminShell title="Services and add-ons" />;
}
