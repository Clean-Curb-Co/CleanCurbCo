import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";

export const metadata: Metadata = {
  title: "Admin Payments",
};

export default function AdminPaymentsPage() {
  return <AdminShell title="Payments" />;
}
