import type { Metadata } from "next";
import { PortalShell } from "@/components/shells/portal-shell";
import { getPortalContext } from "@/lib/portal-data";
import { formatFrequency } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Portal Plan",
};

export default async function PortalSubscriptionPage() {
  const context = await getPortalContext("/portal/subscription");
  const recurringBooking = context.bookings.find(
    (booking) => booking.frequency !== "one_time",
  );

  return (
    <PortalShell title="Recurring service plan" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Plan</p>
        <h1>Recurring service.</h1>
        {recurringBooking ? (
          <div className="grid grid-3">
            <article className="card">
              <h3>Current plan</h3>
              <p>{formatFrequency(recurringBooking.frequency)}</p>
            </article>
            <article className="card">
              <h3>Bins</h3>
              <p>{recurringBooking.bin_count}</p>
            </article>
            <article className="card">
              <h3>Status</h3>
              <p>{recurringBooking.status.replaceAll("_", " ")}</p>
            </article>
          </div>
        ) : (
          <p>
            No recurring route is linked yet. Once you join a Stay Fresh Plan,
            pause/cancel options and add-on requests will appear here.
          </p>
        )}
      </section>
    </PortalShell>
  );
}
