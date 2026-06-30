import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Login",
  description: "Clean Curb Co. customer portal login placeholder.",
};

export default function LoginPage() {
  return (
    <PlaceholderPage
      title="Customer login"
      description="This feature is being built for Clean Curb Co. For now, booking requests are confirmed by text."
      features={[
        "Secure customer login",
        "Upcoming service view",
        "Payment and billing access",
      ]}
      ctaHref="/book"
      ctaLabel="Book Without Login"
    />
  );
}
