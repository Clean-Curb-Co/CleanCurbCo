import type { Metadata } from "next";
import { PortalShell } from "@/components/shells/portal-shell";

export const metadata: Metadata = {
  title: "Portal Referrals",
};

export default function PortalReferralsPage() {
  return <PortalShell title="Referral rewards" />;
}
