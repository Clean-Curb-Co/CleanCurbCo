import type { Metadata } from "next";
import { FieldStopCard } from "@/components/field-stop-card";
import { FieldShell } from "@/components/shells/field-shell";
import { businessToday, getFieldContext } from "@/lib/field-data";

export const metadata: Metadata = {
  title: "Field Today",
};

export default async function FieldTodayPage() {
  const context = await getFieldContext("/field/today");
  const today = businessToday();
  const todaysRoutes = context.routeDays.filter(
    (routeDay) =>
      routeDay.route_date === today &&
      routeDay.status !== "cancelled" &&
      routeDay.status !== "completed",
  );
  const routeDayIds = new Set(todaysRoutes.map((routeDay) => routeDay.id));
  const todaysStops = context.routeStops
    .filter((stop) => stop.route_day_id && routeDayIds.has(stop.route_day_id))
    .sort((a, b) => a.stop_order - b.stop_order);
  const fallbackStops = todaysStops.length
    ? todaysStops
    : context.routeStops
        .filter((stop) => !["completed", "cancelled"].includes(stop.status))
        .slice(0, 8);

  return (
    <FieldShell title="Today's Route" auth={context.auth}>
      <section className="field-panel">
        <div className="field-page-heading">
          <div>
            <p className="section-kicker">Route Day</p>
            <h2>{today}</h2>
            <p>
              Work the list from top to bottom. Open maps, start service, take
              photos, and keep the route record clean.
            </p>
          </div>
          <span className="status-badge status-scheduled">
            {fallbackStops.length} stop(s)
          </span>
        </div>
      </section>

      <section className="field-list" aria-label="Today's route stops">
        {fallbackStops.map((stop) => {
          const visit = context.visits.find((item) => item.id === stop.service_visit_id);
          const booking = context.bookings.find((item) => item.id === stop.booking_id);
          const address = context.addresses.find(
            (item) => item.customer_id === booking?.customer_id && item.is_primary,
          );
          const routeDay = context.routeDays.find((item) => item.id === stop.route_day_id);
          const payment = context.payments.find(
            (item) => item.booking_id === booking?.id || item.service_visit_id === visit?.id,
          );

          return (
            <FieldStopCard
              address={address}
              booking={booking}
              key={stop.id}
              payment={payment}
              routeDay={routeDay}
              stop={stop}
              visit={visit}
            />
          );
        })}
        {!fallbackStops.length ? (
          <article className="field-card">
            <span className="status-badge status-standard">No stops</span>
            <h2>No route stops are scheduled yet.</h2>
            <p>Create a route day and add bookings from the admin route builder.</p>
          </article>
        ) : null}
      </section>
    </FieldShell>
  );
}
