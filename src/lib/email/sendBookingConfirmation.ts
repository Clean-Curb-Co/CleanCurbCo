import { sendTransactionalEmail } from "@/lib/email/resend";
import { bookingConfirmationTemplate } from "@/lib/email/templates";
import type { BookingRow } from "@/types/database";

export function sendBookingConfirmation(booking: BookingRow) {
  const template = bookingConfirmationTemplate(booking);

  return sendTransactionalEmail({
    to: booking.email,
    ...template,
    templateKey: "booking_confirmation",
    relatedBookingId: booking.id,
    idempotencyKey: `booking-confirmation-${booking.id}`,
  });
}
