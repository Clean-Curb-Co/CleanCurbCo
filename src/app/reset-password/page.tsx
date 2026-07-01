import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Clean Curb Co. customer account password.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ code?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const code = params.code;

  return (
    <main>
      <section className="page-hero">
        <div className="container section-header">
          <p className="section-kicker">Password Reset</p>
          <h1>{code ? "Choose a new password." : "Reset your password."}</h1>
          <p>
            We will keep this painless. A clean bin is enough drama for one day.
          </p>
        </div>
      </section>
      <section className="section section-cream">
        <div className="container auth-layout">
          <ResetPasswordForm mode={code ? "update" : "request"} code={code} />
        </div>
      </section>
    </main>
  );
}
