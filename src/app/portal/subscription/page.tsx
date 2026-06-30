import type { Metadata } from "next";
import { PortalShell } from "@/components/shells/portal-shell";

export const metadata: Metadata = {
  title: "Portal Plan",
};

export default function PortalSubscriptionPage() {
  return <PortalShell title="Recurring service plan" />;
}
