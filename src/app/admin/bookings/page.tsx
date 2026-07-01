import type { Metadata } from "next";
import { updateBookingAdminAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/shells/admin-shell";
import {
  humanizeStatus,
  validBookingStatuses,
  validPaymentStatuses,
} from "@/lib/booking-utils";
import { getAdminContext } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Admin Bookings",
};

export default async function AdminBookingsPage() {
  const context = await getAdminContext("/admin/bookings");

  return (
    <AdminShell title="Admin bookings" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Bookings</p>
        <h1>Route requests and service status.</h1>
        {context.bookings.length ? (
          <div className="admin-card-list">
            {context.bookings.map((booking) => (
              <form
                action={updateBookingAdminAction}
                className="admin-edit-card"
                key={booking.id}
              >
                <input type="hidden" name="bookingId" value={booking.id} />
                <div>
                  <h2>
                    {booking.first_name} {booking.last_name}
                  </h2>
                  <p className="muted">
                    {booking.phone} | {booking.email}
                    <br />
                    {booking.street_address}, {booking.city}, {booking.state}{" "}
                    {booking.zip_code}
                    <br />
                    {booking.neighborhood ?? "Neighborhood not provided"} |{" "}
                    {booking.bin_count} bins | ${booking.estimated_price}
                  </p>
                </div>
                <div className="form-grid">
                  <label className="field">
                    <span>Status</span>
                    <select name="status" defaultValue={booking.status}>
                      {validBookingStatuses.map((status) => (
                        <option value={status} key={status}>
                          {humanizeStatus(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Route day</span>
                    <input
                      type="date"
                      name="confirmedRouteDay"
                      defaultValue={booking.confirmed_route_day ?? ""}
                    />
                  </label>
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
                    <input
                      name="paymentMethod"
                      defaultValue={booking.payment_method ?? ""}
                      placeholder="Stripe, Square, Venmo, Zelle, manual"
                    />
                  </label>
                  <label className="field">
                    <span>Payment provider</span>
                    <input
                      name="paymentProvider"
                      defaultValue={booking.payment_provider ?? ""}
                    />
                  </label>
                  <label className="field">
                    <span>Payment reference</span>
                    <input
                      name="paymentReference"
                      defaultValue={booking.payment_reference ?? ""}
                    />
                  </label>
                  <label className="choice-card">
                    <input type="checkbox" name="sendRouteEmail" />
                    <span>Send route confirmation email after saving</span>
                  </label>
                </div>
                <label className="field">
                  <span>Internal notes</span>
                  <textarea
                    name="internalNotes"
                    defaultValue={booking.internal_notes ?? ""}
                  />
                </label>
                <p className="muted">
                  Customer notes: {booking.customer_notes ?? "None"} | Water
                  spigot: {booking.water_spigot_available ?? "Not sure"}
                </p>
                <button className="button button-dark" type="submit">
                  Save Booking
                </button>
              </form>
            ))}
          </div>
        ) : (
          <p>No booking requests yet.</p>
        )}
      </section>
    </AdminShell>
  );
}
