import type { Metadata } from "next";
import { PortalShell } from "@/components/shells/portal-shell";

export const metadata: Metadata = {
  title: "Portal Photos",
};

export default function PortalPhotosPage() {
  return <PortalShell title="Before and after photos" />;
}
