import Link from "next/link";
import type { Metadata } from "next";
import { FieldShell } from "@/components/shells/field-shell";
import { humanizeStatus } from "@/lib/booking-utils";
import { getFieldContext } from "@/lib/field-data";

export const metadata: Metadata = {
  title: "Field Routes",
};

export default async function FieldRoutesPage() {
  const context = await getFieldContext("/field/routes");

  return (
    <FieldShell title="Routes" auth={context.auth}>
      <section className="field-list">
        {context.routeDays.map((routeDay) => {
          const stops = context.routeStops
            .filter((stop) => stop.route_day_id === routeDay.id)
            .sort((a, b) => a.stop_order - b.stop_order);
          const completed = stops.filter((stop) => stop.status === "completed").length;

          return (
            <article className="field-card" key={routeDay.id}>
              <div className="field-card-top">
                <span className={`status-badge status-${routeDay.status}`}>
                  {humanizeStatus(routeDay.status)}
                </span>
                <span className="status-badge">
                  {completed}/{stops.length} complete
                </span>
              </div>
              <h2>{routeDay.route_name ?? `${routeDay.service_area} route`}</h2>
              <p>
                {routeDay.route_date} | {routeDay.service_area ?? "Cane Bay"}
              </p>
              {routeDay.notes ? <p className="field-note">{routeDay.notes}</p> : null}
              <div className="field-mini-list">
                {stops.slice(0, 6).map((stop) => {
                  const booking = context.bookings.find((item) => item.id === stop.booking_id);
                  return (
                    <Link
                      href={`/field/stops/${stop.service_visit_id}`}
                      key={stop.id}
                    >
                      #{stop.stop_order} {booking?.street_address ?? "Stop details"}
                    </Link>
                  );
                })}
              </div>
            </article>
          );
        })}
        {!context.routeDays.length ? (
          <article className="field-card">
            <span className="status-badge status-standard">No routes</span>
            <h2>No route days are built yet.</h2>
            <p>Admin can create route days and add stops from /admin/routes.</p>
          </article>
        ) : null}
      </section>
    </FieldShell>
  );
}
