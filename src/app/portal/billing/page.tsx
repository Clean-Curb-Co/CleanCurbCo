import type { Metadata } from "next";
import { PortalShell } from "@/components/shells/portal-shell";
import { humanizeStatus } from "@/lib/booking-utils";
import { getPortalContext } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Portal Billing",
};

export default async function PortalBillingPage() {
  const context = await getPortalContext("/portal/billing");

  return (
    <PortalShell title="Billing and payments" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Billing</p>
        <h1>Payment history and links.</h1>
        {context.bookings.length ? (
          <div className="data-table">
            {context.bookings.map((booking) => (
              <article className="data-row" key={booking.id}>
                <div>
                  <strong>${booking.estimated_price}</strong>
                  <span>{booking.street_address}</span>
                </div>
                <span>{humanizeStatus(booking.payment_status)}</span>
                {booking.payment_link ? (
                  <a className="button button-outline" href={booking.payment_link}>
                    Pay Now
                  </a>
                ) : (
                  <span>Payment link pending</span>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p>No billing records are linked yet.</p>
        )}
      </section>
    </PortalShell>
  );
}
