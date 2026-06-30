import type { Metadata } from "next";
import { PortalShell } from "@/components/shells/portal-shell";

export const metadata: Metadata = {
  title: "Customer Portal",
  description: "Future Clean Curb Co. customer portal.",
};

export default function PortalPage() {
  return <PortalShell title="Customer portal" />;
}
