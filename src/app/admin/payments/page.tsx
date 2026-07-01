import type { Metadata } from "next";
import { updateBookingAdminAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/shells/admin-shell";
import { humanizeStatus, validPaymentStatuses } from "@/lib/booking-utils";
import { getAdminContext } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Admin Payments",
};

export default async function AdminPaymentsPage() {
  const context = await getAdminContext("/admin/payments");

  return (
    <AdminShell title="Payments" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Payments</p>
        <h1>Payment links and status.</h1>
        <div className="admin-card-list">
          {context.bookings.map((booking) => (
            <form
              action={updateBookingAdminAction}
              className="admin-edit-card"
              key={booking.id}
            >
              <input type="hidden" name="bookingId" value={booking.id} />
              <input type="hidden" name="status" value={booking.status} />
              <input
                type="hidden"
                name="confirmedRouteDay"
                value={booking.confirmed_route_day ?? ""}
              />
              <input
                type="hidden"
                name="internalNotes"
                value={booking.internal_notes ?? ""}
              />
              <h2>
                {booking.first_name} {booking.last_name} | $
                {booking.estimated_price}
              </h2>
              <div className="form-grid">
                <label className="field">
                  <span>Payment status</span>
                  <select name="paymentStatus" defaultValue={booking.payment_status}>
                    {validPaymentStatuses.map((status) => (
                      <option value={status} key={status}>
                        {humanizeStatus(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Payment link</span>
                  <input name="paymentLink" defaultValue={booking.payment_link ?? ""} />
                </label>
                <label className="field">
                  <span>Payment method</span>
                  <input name="paymentMethod" defaultValue={booking.payment_method ?? ""} />
                </label>
                <label className="field">
                  <span>Provider</span>
                  <input
                    name="paymentProvider"
                    defaultValue={booking.payment_provider ?? ""}
                  />
                </label>
              </div>
              <button className="button button-dark" type="submit">
                Save Payment
              </button>
            </form>
          ))}
          {!context.bookings.length ? <p>No payments to manage yet.</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}
