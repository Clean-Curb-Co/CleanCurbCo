import { sendTransactionalEmail } from "@/lib/email/resend";
import { contactConfirmationTemplate } from "@/lib/email/templates";
import type { ContactMessageRow } from "@/types/database";

export function sendContactConfirmation(message: ContactMessageRow) {
  const template = contactConfirmationTemplate(message);

  return sendTransactionalEmail({
    to: message.email,
    ...template,
    templateKey: "contact_confirmation",
    idempotencyKey: `contact-confirmation-${message.id}`,
  });
}
