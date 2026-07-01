import type { Metadata } from "next";
import { ManageServiceWorkflow } from "@/components/manage-service-workflow";
import { PortalShell } from "@/components/shells/portal-shell";
import { getPortalContext } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Manage Service",
};

export default async function PortalManageServicePage() {
  const context = await getPortalContext("/portal/manage-service");
  const profileName =
    context.auth.status === "ok"
      ? [context.auth.profile.first_name, context.auth.profile.last_name]
          .filter(Boolean)
          .join(" ")
      : "";
  const primaryAddress =
    context.addresses.find((address) => address.is_primary) ?? context.addresses[0];

  return (
    <PortalShell title="Manage service" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Manage Service</p>
        <h1>Need a change? You can start it here.</h1>
        <p className="muted">
          Cancel, pause, reschedule, change frequency, update your address, add
          services, drop services, or ask a billing question. Timing policies
          are shown before anything is submitted.
        </p>
        <ManageServiceWorkflow
          profileName={profileName}
          bookings={context.bookings}
          visits={context.visits}
          requests={context.requests}
          primaryAddress={primaryAddress}
        />
      </section>
    </PortalShell>
  );
}
