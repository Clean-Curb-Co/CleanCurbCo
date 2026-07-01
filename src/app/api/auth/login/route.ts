import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  canRoleAccessPath,
  defaultRouteForRole,
} from "@/lib/supabase/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cleanString, isValidEmail } from "@/lib/validation";
import type { AppRole } from "@/types/database";

type LoginPayload = {
  email?: unknown;
  password?: unknown;
  next?: unknown;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Login is being connected. Please contact Clean Curb Co." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as LoginPayload;
  const email = cleanString(body.email, 120).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const requestedNext = cleanString(body.next, 200);

  if (!isValidEmail(email) || !password) {
    return NextResponse.json(
      { error: "Please enter a valid email and password." },
      { status: 400 },
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: "That login did not work. Check your email and password." },
      { status: 401 },
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  const role = (profile?.role ?? "customer") as AppRole;
  const fallbackRoute = defaultRouteForRole(role);
  const redirectTo =
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    canRoleAccessPath(role, requestedNext)
      ? requestedNext
      : fallbackRoute;

  return NextResponse.json({ redirectTo });
}
