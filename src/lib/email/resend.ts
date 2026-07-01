import "server-only";

import { Resend } from "resend";
import { getResendEnv, isResendConfigured } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  templateKey: string;
  relatedBookingId?: string | null;
  relatedVisitId?: string | null;
  idempotencyKey?: string;
};

let resendClient: Resend | null = null;

function getResendClient() {
  const { apiKey } = getResendEnv();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export async function sendTransactionalEmail(input: SendEmailInput) {
  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  const { from, replyTo } = getResendEnv();

  if (!recipients.length) {
    return { status: "skipped" as const, reason: "No recipients configured." };
  }

  if (!isResendConfigured()) {
    await Promise.all(
      recipients.map((recipient) =>
        recordEmailEvent({
          recipient,
          subject: input.subject,
          templateKey: input.templateKey,
          status: "failed",
          errorMessage: "Resend is not configured.",
          relatedBookingId: input.relatedBookingId,
          relatedVisitId: input.relatedVisitId,
        }),
      ),
    );

    return { status: "skipped" as const, reason: "Resend is not configured." };
  }

  const resend = getResendClient();
  const { data, error } = await resend.emails.send(
    {
      from,
      to: recipients,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo,
    },
    input.idempotencyKey
      ? {
          headers: {
            "Idempotency-Key": input.idempotencyKey,
          },
        }
      : undefined,
  );

  await Promise.all(
    recipients.map((recipient) =>
      recordEmailEvent({
        recipient,
        subject: input.subject,
        templateKey: input.templateKey,
        status: error ? "failed" : "sent",
        resendId: data?.id ?? null,
        errorMessage: error ? JSON.stringify(error) : null,
        relatedBookingId: input.relatedBookingId,
        relatedVisitId: input.relatedVisitId,
      }),
    ),
  );

  if (error) {
    return { status: "failed" as const, error };
  }

  return { status: "sent" as const, id: data?.id ?? null };
}

async function recordEmailEvent(input: {
  recipient: string;
  subject: string;
  templateKey: string;
  status: "sent" | "failed";
  resendId?: string | null;
  errorMessage?: string | null;
  relatedBookingId?: string | null;
  relatedVisitId?: string | null;
}) {
  try {
    const admin = getSupabaseAdmin();
    await admin.from("email_events").insert({
      recipient_email: input.recipient,
      subject: input.subject,
      template_key: input.templateKey,
      status: input.status,
      resend_id: input.resendId ?? null,
      error_message: input.errorMessage ?? null,
      related_booking_id: input.relatedBookingId ?? null,
      related_visit_id: input.relatedVisitId ?? null,
    });
  } catch {
    // Email logging should never block a customer-facing form.
  }
}
