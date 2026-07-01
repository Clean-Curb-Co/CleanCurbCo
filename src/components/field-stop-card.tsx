import Link from "next/link";
import { updateStopStatusAction } from "@/app/field/actions";
import { formatBookingAddress, humanizeStatus } from "@/lib/booking-utils";
import { formatFrequency } from "@/lib/pricing";
import type {
  BookingRow,
  PaymentRow,
  RouteDayRow,
  RouteStopRow,
  ServiceAddressRow,
  ServiceVisitRow,
} from "@/types/database";

type FieldStopCardProps = {
  stop: RouteStopRow;
  visit?: ServiceVisitRow | null;
  booking?: BookingRow | null;
  address?: ServiceAddressRow | null;
  routeDay?: RouteDayRow | null;
  payment?: PaymentRow | null;
};

export function FieldStopCard({
  stop,
  visit,
  booking,
  address,
  routeDay,
  payment,
}: FieldStopCardProps) {
  if (!booking || !visit) {
    return (
      <article className="field-card">
        <span className="status-badge status-needs_follow_up">Needs Setup</span>
        <h2>Stop #{stop.stop_order}</h2>
        <p>This route stop is missing a linked booking or service visit.</p>
      </article>
    );
  }

  const addressText = formatBookingAddress(booking);
  const encodedAddress = encodeURIComponent(addressText);
  const appleMaps = `https://maps.apple.com/?q=${encodedAddress}`;
  const googleMaps = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const addOns = booking.add_ons.length ? booking.add_ons.join(", ") : "None";
  const paymentStatus = payment?.status ?? booking.payment_status;

  return (
    <article className="field-card">
      <div className="field-card-top">
        <span className="field-stop-number">#{stop.stop_order || 1}</span>
        <div className="status-stack">
          <span className={`status-badge status-${stop.status}`}>
            {humanizeStatus(stop.status)}
          </span>
          <span className={`status-badge status-${paymentStatus}`}>
            {humanizeStatus(paymentStatus)}
          </span>
        </div>
      </div>
      <h2>
        {booking.first_name} {booking.last_name}
      </h2>
      <p className="field-address">{addressText}</p>
      <div className="field-meta-grid">
        <span>{booking.neighborhood ?? "No neighborhood"}</span>
        <span>{booking.bin_count} bin(s)</span>
        <span>{booking.bin_types.join(", ") || "Bin type pending"}</span>
        <span>{formatFrequency(booking.frequency)}</span>
        <span>Add-ons: {addOns}</span>
        <span>Water: {booking.water_spigot_available ?? "not sure"}</span>
        <span>Gate: {address?.gate_code ?? "none"}</span>
        <span>Route: {routeDay?.route_name ?? routeDay?.route_date ?? "not assigned"}</span>
      </div>
      {booking.customer_notes || address?.notes || stop.technician_notes ? (
        <p className="field-note">
          {booking.customer_notes ?? address?.notes ?? stop.technician_notes}
        </p>
      ) : null}
      <div className="field-actions">
        <a className="button button-outline" href={appleMaps} target="_blank" rel="noreferrer">
          Apple Maps
        </a>
        <a className="button button-outline" href={googleMaps} target="_blank" rel="noreferrer">
          Google Maps
        </a>
        <form action={updateStopStatusAction}>
          <input type="hidden" name="visitId" value={visit.id} />
          <input type="hidden" name="status" value="in_progress" />
          <button className="button button-primary" type="submit">
            Start Service
          </button>
        </form>
        <Link className="button button-dark" href={`/field/stops/${visit.id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}
