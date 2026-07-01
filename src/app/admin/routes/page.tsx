import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";
import { humanizeStatus } from "@/lib/booking-utils";
import { getAdminContext } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Admin Routes",
};

export default async function AdminRoutesPage() {
  const context = await getAdminContext("/admin/routes");
  const grouped = groupByRoute(context.bookings);

  return (
    <AdminShell title="Route builder" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Routes</p>
        <h1>Neighborhood route grouping.</h1>
        <div className="grid grid-2">
          {Object.entries(grouped).map(([groupName, bookings]) => (
            <article className="card" key={groupName}>
              <h3>{groupName}</h3>
              {bookings.map((booking) => (
                <p key={booking.id}>
                  <strong>
                    {booking.first_name} {booking.last_name}
                  </strong>
                  <br />
                  {booking.street_address} | {humanizeStatus(booking.status)}
                  <br />
                  Route day: {booking.confirmed_route_day ?? "Pending"}
                </p>
              ))}
            </article>
          ))}
          {!context.bookings.length ? <p>No routeable bookings yet.</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}

function groupByRoute(bookings: Awaited<ReturnType<typeof getAdminContext>>["bookings"]) {
  return bookings.reduce<Record<string, typeof bookings>>((groups, booking) => {
    const key = `${booking.neighborhood ?? "No neighborhood"} | ${
      booking.confirmed_route_day ?? "Route day pending"
    }`;
    groups[key] = groups[key] ? [...groups[key], booking] : [booking];
    return groups;
  }, {});
}
