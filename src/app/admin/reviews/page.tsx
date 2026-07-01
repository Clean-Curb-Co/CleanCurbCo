import type { Metadata } from "next";
import { sendReviewRequestAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/shells/admin-shell";
import { getAdminContext } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Admin Reviews",
};

export default async function AdminReviewsPage() {
  const context = await getAdminContext("/admin/reviews");
  const reviewCandidates = context.bookings.filter((booking) =>
    ["completed", "paid"].includes(booking.status),
  );

  return (
    <AdminShell title="Reviews" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Reviews</p>
        <h1>Review request follow-up.</h1>
        <div className="data-table">
          {reviewCandidates.map((booking) => (
            <form
              action={sendReviewRequestAction}
              className="data-row"
              key={booking.id}
            >
              <input type="hidden" name="bookingId" value={booking.id} />
              <div>
                <strong>
                  {booking.first_name} {booking.last_name}
                </strong>
                <span>{booking.email}</span>
              </div>
              <span>{booking.status}</span>
              <button className="button button-outline" type="submit">
                Send Review Request
              </button>
            </form>
          ))}
          {!reviewCandidates.length ? (
            <p>Completed bookings will appear here for review follow-up.</p>
          ) : null}
        </div>
      </section>
    </AdminShell>
  );
}
