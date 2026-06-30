import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";

export const metadata: Metadata = {
  title: "Admin Customers",
};

export default function AdminCustomersPage() {
  return <AdminShell title="Customer list" />;
}
