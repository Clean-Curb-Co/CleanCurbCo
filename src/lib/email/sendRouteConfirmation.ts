import { sendTransactionalEmail } from "@/lib/email/resend";
import { routeConfirmationTemplate } from "@/lib/email/templates";
import type { BookingRow } from "@/types/database";

export function sendRouteConfirmation(booking: BookingRow, routeDay: string) {
  const template = routeConfirmationTemplate(booking, routeDay);

  return sendTransactionalEmail({
    to: booking.email,
    ...template,
    templateKey: "route_confirmation",
    relatedBookingId: booking.id,
    idempotencyKey: `route-confirmation-${booking.id}-${routeDay}`,
  });
}
