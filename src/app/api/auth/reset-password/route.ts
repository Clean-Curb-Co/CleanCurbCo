import { NextResponse } from "next/server";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cleanString, isValidEmail } from "@/lib/validation";

type ResetPayload = {
  email?: unknown;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Password reset is being connected. Please contact us directly." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as ResetPayload;
  const email = cleanString(body.email, 120).toLowerCase();

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const supabase = await createServerSupabaseClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/reset-password`,
  });

  return NextResponse.json({
    message:
      "If an account exists for that email, a password reset link is on the way.",
  });
}
