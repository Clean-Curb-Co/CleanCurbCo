import Link from "next/link";
import type { Metadata } from "next";
import { FieldShell } from "@/components/shells/field-shell";
import { formatBookingAddress, humanizeStatus } from "@/lib/booking-utils";
import { getFieldContext } from "@/lib/field-data";

export const metadata: Metadata = {
  title: "Field History",
};

export default async function FieldHistoryPage() {
  const context = await getFieldContext("/field/history");
  const completedStops = context.routeStops
    .filter((stop) => ["completed", "skipped", "needs_follow_up"].includes(stop.status))
    .sort((a, b) => (b.completed_at ?? b.updated_at).localeCompare(a.completed_at ?? a.updated_at));

  return (
    <FieldShell title="History" auth={context.auth}>
      <section className="field-list">
        {completedStops.map((stop) => {
          const visit = context.visits.find((item) => item.id === stop.service_visit_id);
          const booking = context.bookings.find((item) => item.id === stop.booking_id);
          const photoCount = context.photos.filter((photo) => photo.route_stop_id === stop.id).length;

          return (
            <article className="field-card compact-field-card" key={stop.id}>
              <div className="field-card-top">
                <span className={`status-badge status-${stop.status}`}>
                  {humanizeStatus(stop.status)}
                </span>
                <span>{stop.completed_at ? new Date(stop.completed_at).toLocaleString() : "No end time"}</span>
              </div>
              <h2>
                #{stop.stop_order} {booking ? `${booking.first_name} ${booking.last_name}` : "Stop"}
              </h2>
              {booking ? <p>{formatBookingAddress(booking)}</p> : null}
              <p>{photoCount} photo(s) saved</p>
              {visit ? (
                <Link className="button button-outline" href={`/field/stops/${visit.id}`}>
                  Open Stop
                </Link>
              ) : null}
            </article>
          );
        })}
        {!completedStops.length ? (
          <article className="field-card">
            <span className="status-badge status-standard">No history</span>
            <h2>No completed field stops yet.</h2>
          </article>
        ) : null}
      </section>
    </FieldShell>
  );
}
