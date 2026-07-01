import type { Metadata } from "next";
import { PortalShell } from "@/components/shells/portal-shell";
import { brand } from "@/lib/site";
import { getPortalContext } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Portal Referrals",
};

export default async function PortalReferralsPage() {
  const context = await getPortalContext("/portal/referrals");

  return (
    <PortalShell title="Referral rewards" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Referrals</p>
        <h1>Neighbor routes get better with neighbors.</h1>
        <p>
          Referral rewards will connect here as the Cane Bay route grows. For
          now, send a neighbor to the booking page or have them mention your
          name when they contact us.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href={brand.emailHref}>
            Email Clean Curb Co.
          </a>
          <a className="button button-outline" href={brand.phoneHref}>
            Call {brand.phone}
          </a>
        </div>
      </section>
    </PortalShell>
  );
}
