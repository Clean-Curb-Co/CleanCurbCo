import "server-only";

import { createHash, randomBytes } from "crypto";
import { getSiteUrl } from "@/lib/env";

export function createClaimToken() {
  return randomBytes(32).toString("base64url");
}

export function hashClaimToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createAccountSetupLink(bookingId: string, token: string) {
  const url = new URL("/account-setup", getSiteUrl());
  url.searchParams.set("booking", bookingId);
  url.searchParams.set("token", token);
  return url.toString();
}
