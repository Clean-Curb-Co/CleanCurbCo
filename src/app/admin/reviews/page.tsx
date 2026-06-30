import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";

export const metadata: Metadata = {
  title: "Admin Reviews",
};

export default function AdminReviewsPage() {
  return <AdminShell title="Reviews" />;
}
