import "server-only";

import {
  fieldOnTheWayTemplate,
  paymentLinkTemplate,
  reviewRequestTemplate,
  serviceCompletedTemplate,
} from "@/lib/email/templates";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { BookingRow } from "@/types/database";

type RelatedIds = {
  bookingId?: string | null;
  visitId?: string | null;
  routeStopId?: string | null;
};

async function recordNotification(input: {
  booking: BookingRow;
  templateKey: string;
  status: "sent" | "failed" | "skipped";
  resendId?: string | null;
  errorMessage?: string | null;
} & RelatedIds) {
  try {
    const admin = getSupabaseAdmin();
    await admin.from("notification_events").insert({
      recipient_profile_id: input.booking.customer_id,
      recipient_email: input.booking.email,
      recipient_phone: input.booking.phone,
      channel: "email",
      template_key: input.templateKey,
      status: input.status,
      resend_id: input.resendId ?? null,
      error_message: input.errorMessage ?? null,
      related_booking_id: input.bookingId ?? input.booking.id,
      related_visit_id: input.visitId ?? null,
      related_route_stop_id: input.routeStopId ?? null,
    });
  } catch {
    // Notification logging should not block field work.
  }
}

async function sendAndLog(
  booking: BookingRow,
  templateKey: string,
  template: ReturnType<typeof fieldOnTheWayTemplate>,
  ids: RelatedIds,
) {
  const result = await sendTransactionalEmail({
    to: booking.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    templateKey,
    relatedBookingId: ids.bookingId ?? booking.id,
    relatedVisitId: ids.visitId ?? null,
  });

  await recordNotification({
    booking,
    templateKey,
    status: result.status === "sent" ? "sent" : result.status === "failed" ? "failed" : "skipped",
    resendId: "id" in result ? result.id : null,
    errorMessage:
      result.status === "failed" ? JSON.stringify(result.error) : result.status === "skipped" ? result.reason : null,
    ...ids,
  });

  return result;
}

export async function sendOnTheWayEmail(booking: BookingRow, ids: RelatedIds) {
  return sendAndLog(booking, "field_on_the_way", fieldOnTheWayTemplate(booking), ids);
}

export async function sendServiceCompletedEmail(
  booking: BookingRow,
  ids: RelatedIds & { paymentLink?: string | null },
) {
  return sendAndLog(
    booking,
    "service_completed",
    serviceCompletedTemplate(booking, ids.paymentLink),
    ids,
  );
}

export async function sendFieldPaymentLinkEmail(
  booking: BookingRow,
  ids: RelatedIds,
) {
  return sendAndLog(booking, "payment_link", paymentLinkTemplate(booking), ids);
}

export async function sendFieldReviewRequestEmail(
  booking: BookingRow,
  ids: RelatedIds,
) {
  return sendAndLog(booking, "review_request", reviewRequestTemplate(booking), ids);
}
