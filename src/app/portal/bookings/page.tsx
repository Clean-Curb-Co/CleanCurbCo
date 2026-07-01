import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/shells/portal-shell";
import { humanizeStatus } from "@/lib/booking-utils";
import { getPortalContext } from "@/lib/portal-data";
import { formatFrequency } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Portal Bookings",
};

export default async function PortalBookingsPage() {
  const context = await getPortalContext("/portal/bookings");

  return (
    <PortalShell title="Portal bookings" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Bookings</p>
        <h1>Your booking requests.</h1>
        {context.bookings.length ? (
          <div className="data-table">
            {context.bookings.map((booking) => (
              <article className="data-row" key={booking.id}>
                <div>
                  <strong>{formatFrequency(booking.frequency)}</strong>
                  <span>
                    {booking.bin_count}{" "}
                    {booking.bin_count === 1 ? "bin" : "bins"} at{" "}
                    {booking.street_address}
                  </span>
                </div>
                <span>{humanizeStatus(booking.status)}</span>
                <span>${booking.estimated_price}</span>
                <span>
                  {booking.confirmed_route_day ??
                    booking.requested_date ??
                    "Route day pending"}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <>
            <p>No bookings are linked to this account yet.</p>
            <Link className="button button-dark" href="/book">
              Book a Cleaning
            </Link>
          </>
        )}
      </section>
    </PortalShell>
  );
}
