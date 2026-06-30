import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";

export const metadata: Metadata = {
  title: "Admin Routes",
};

export default function AdminRoutesPage() {
  return <AdminShell title="Route builder" />;
}
