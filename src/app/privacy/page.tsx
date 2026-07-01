import type { Metadata } from "next";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Clean Curb Co. privacy policy.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container section-header">
          <p className="section-kicker">Privacy</p>
          <h1>Privacy Policy</h1>
          <p>
            Plain-language privacy notes for Clean Curb Co. customers and route
            requests.
          </p>
        </div>
      </section>
      <section className="section section-white">
        <div className="container legal-copy">
          <h2>Information we collect</h2>
          <p>
            We collect the contact, service address, booking, add-on,
            scheduling, payment-status, and service-instruction details needed
            to provide garbage bin cleaning service.
          </p>
          <h2>How we use it</h2>
          <p>
            We use this information to confirm route days, communicate about
            service, send payment links, provide before/after service updates,
            answer questions, and improve neighborhood routes.
          </p>
          <h2>Photos</h2>
          <p>
            Before/after photos may be used for service verification. We do not
            identify your address publicly without permission.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about privacy can be sent to{" "}
            <a href={brand.emailHref}>{brand.email}</a> or by calling{" "}
            <a href={brand.phoneHref}>{brand.phone}</a>.
          </p>
          <p className="muted">{brand.legalNote}</p>
        </div>
      </section>
    </main>
  );
}
