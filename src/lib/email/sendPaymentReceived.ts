import "server-only";

import { sendTransactionalEmail } from "@/lib/email/resend";
import { paymentReceivedTemplate } from "@/lib/email/templates";
import type { BookingRow } from "@/types/database";

export function sendPaymentReceived(booking: BookingRow, amount: number) {
  const template = paymentReceivedTemplate(booking, amount);

  return sendTransactionalEmail({
    to: booking.email,
    ...template,
    templateKey: "payment_received",
    relatedBookingId: booking.id,
    idempotencyKey: `payment-received-${booking.id}-${amount}`,
  });
}
