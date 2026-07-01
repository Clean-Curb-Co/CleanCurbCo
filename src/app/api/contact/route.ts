import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { sendAdminContactNotification } from "@/lib/email/sendAdminContactNotification";
import { sendContactConfirmation } from "@/lib/email/sendContactConfirmation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { cleanLongText, cleanString, isValidEmail } from "@/lib/validation";

type ContactPayload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  location?: unknown;
  reason?: unknown;
  message?: unknown;
};

const validReasons = [
  "Booking question",
  "Waitlist",
  "General question",
  "HOA or group route",
] as const;

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Messaging is being connected. Please call or email Clean Curb Co. and we will help directly.",
      },
      { status: 503 },
    );
  }

  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid contact request." }, { status: 400 });
  }

  const name = cleanString(body.name, 120);
  const phone = cleanString(body.phone, 40) || null;
  const email = cleanString(body.email, 120).toLowerCase();
  const location = cleanString(body.location, 200) || null;
  const reason = validReasons.includes(body.reason as (typeof validReasons)[number])
    ? (body.reason as (typeof validReasons)[number])
    : "General question";
  const message = cleanLongText(body.message, 2000);

  if (!name || !email || !isValidEmail(email) || !message) {
    return NextResponse.json(
      { error: "Please include your name, valid email, and message." },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("contact_messages")
    .insert({
      name,
      phone,
      email,
      address_or_neighborhood: location,
      reason,
      message,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "We could not save that message. Please try again." },
      { status: 500 },
    );
  }

  await Promise.allSettled([
    sendContactConfirmation(data),
    sendAdminContactNotification(data),
  ]);

  return NextResponse.json(
    {
      message:
        "Thanks! Your note has been received. We will follow up soon.",
      contact: data,
    },
    { status: 201 },
  );
}
