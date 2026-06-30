import type { Metadata } from "next";
import { PortalShell } from "@/components/shells/portal-shell";

export const metadata: Metadata = {
  title: "Portal Billing",
};

export default function PortalBillingPage() {
  return <PortalShell title="Billing and payments" />;
}
