"use server";

import { revalidatePath } from "next/cache";
import {
  validBookingStatuses,
  validPaymentStatuses,
} from "@/lib/booking-utils";
import { sendReviewRequest } from "@/lib/email/sendReviewRequest";
import { sendRouteConfirmation } from "@/lib/email/sendRouteConfirmation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth";
import { cleanLongText, cleanString, pickEnum } from "@/lib/validation";
import type { BookingStatus, PaymentStatus } from "@/types/booking";

export async function updateBookingAdminAction(formData: FormData) {
  const auth = await requireAdmin("/admin/bookings");
  if (auth.status !== "ok") return;

  const bookingId = cleanString(formData.get("bookingId"), 80);
  if (!bookingId) return;

  const status = pickEnum<BookingStatus>(
    formData.get("status"),
    validBookingStatuses,
    "new",
  );
  const paymentStatus = pickEnum<PaymentStatus>(
    formData.get("paymentStatus"),
    validPaymentStatuses,
    "not_sent",
  );
  const confirmedRouteDay =
    cleanString(formData.get("confirmedRouteDay"), 30) || null;
  const internalNotes = cleanLongText(formData.get("internalNotes"), 2000) || null;
  const paymentLink = cleanString(formData.get("paymentLink"), 500) || null;
  const paymentMethod = cleanString(formData.get("paymentMethod"), 80) || null;
  const paymentProvider = cleanString(formData.get("paymentProvider"), 80) || null;
  const paymentReference =
    cleanString(formData.get("paymentReference"), 120) || null;

  const admin = getSupabaseAdmin();
  const { data: updatedBooking } = await admin
    .from("bookings")
    .update({
      status,
      confirmed_route_day: confirmedRouteDay,
      internal_notes: internalNotes,
      payment_status: paymentStatus,
      payment_link: paymentLink,
      payment_method: paymentMethod,
      payment_provider: paymentProvider,
      payment_reference: paymentReference,
    })
    .eq("id", bookingId)
    .select("*")
    .single();

  if (
    updatedBooking &&
    confirmedRouteDay &&
    formData.get("sendRouteEmail") === "on"
  ) {
    await sendRouteConfirmation(updatedBooking, confirmedRouteDay);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/routes");
  revalidatePath("/admin/payments");
}

export async function sendReviewRequestAction(formData: FormData) {
  const auth = await requireAdmin("/admin/reviews");
  if (auth.status !== "ok") return;

  const bookingId = cleanString(formData.get("bookingId"), 80);
  if (!bookingId) return;

  const admin = getSupabaseAdmin();
  const { data: booking } = await admin
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .maybeSingle();

  if (booking) {
    await sendReviewRequest(booking);
  }

  revalidatePath("/admin/reviews");
}
