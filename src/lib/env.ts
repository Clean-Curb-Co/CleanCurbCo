export function getPublicSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getPublicSupabaseEnv();
  return Boolean(url && anonKey && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://clean-curb-co-beta.vercel.app"
  );
}

export function getResendEnv() {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  return {
    apiKey: process.env.RESEND_API_KEY ?? "",
    from:
      process.env.RESEND_FROM_EMAIL ??
      "Clean Curb Co. <cleancurbco@stonebranchcapital.com>",
    replyTo:
      process.env.RESEND_REPLY_TO ?? "cleancurbco@stonebranchcapital.com",
    adminEmails: adminEmails.length
      ? adminEmails
      : ["cleancurbco@stonebranchcapital.com"],
  };
}

export function isResendConfigured() {
  const { apiKey, from } = getResendEnv();
  return Boolean(apiKey && from);
}

export function getStripeEnv() {
  return {
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    currency: (process.env.STRIPE_CURRENCY ?? "usd").toLowerCase(),
  };
}

export function isStripeConfigured() {
  const { secretKey, publishableKey } = getStripeEnv();
  return Boolean(secretKey && publishableKey);
}
