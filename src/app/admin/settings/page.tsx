import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";

export const metadata: Metadata = {
  title: "Admin Settings",
};

export default function AdminSettingsPage() {
  return <AdminShell title="Settings and pricing" />;
}
