import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cleanString } from "@/lib/validation";

type UpdatePayload = {
  code?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Password reset is being connected. Please contact us directly." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as UpdatePayload;
  const code = cleanString(body.code, 300);
  const password = typeof body.password === "string" ? body.password : "";

  if (!code || password.length < 8) {
    return NextResponse.json(
      { error: "Please use a valid reset link and an 8+ character password." },
      { status: 400 },
    );
  }

  const supabase = await createServerSupabaseClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.json(
      { error: "That reset link is expired or invalid." },
      { status: 400 },
    );
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    return NextResponse.json(
      { error: "We could not update that password. Please try again." },
      { status: 500 },
    );
  }

  await supabase.auth.signOut();

  return NextResponse.json({ redirectTo: "/login?reset=complete" });
}
