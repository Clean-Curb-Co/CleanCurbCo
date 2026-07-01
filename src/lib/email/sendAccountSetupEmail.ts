import { sendTransactionalEmail } from "@/lib/email/resend";
import { accountSetupTemplate } from "@/lib/email/templates";
import type { BookingRow } from "@/types/database";

export function sendAccountSetupEmail(booking: BookingRow, setupLink: string) {
  const template = accountSetupTemplate(booking, setupLink);

  return sendTransactionalEmail({
    to: booking.email,
    ...template,
    templateKey: "account_setup",
    relatedBookingId: booking.id,
    idempotencyKey: `account-setup-${booking.id}`,
  });
}
