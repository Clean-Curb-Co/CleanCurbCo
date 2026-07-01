import { sendTransactionalEmail } from "@/lib/email/resend";
import { reviewRequestTemplate } from "@/lib/email/templates";
import type { BookingRow } from "@/types/database";

export function sendReviewRequest(booking: BookingRow) {
  const template = reviewRequestTemplate(booking);

  return sendTransactionalEmail({
    to: booking.email,
    ...template,
    templateKey: "review_request",
    relatedBookingId: booking.id,
    idempotencyKey: `review-request-${booking.id}`,
  });
}
