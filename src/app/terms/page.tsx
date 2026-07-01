import type { Metadata } from "next";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Clean Curb Co. service terms.",
};

export default function TermsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container section-header">
          <p className="section-kicker">Terms</p>
          <h1>Terms of Service</h1>
          <p>
            Friendly service, clear expectations, and clean bins without the
            mystery.
          </p>
        </div>
      </section>
      <section className="section section-white">
        <div className="container legal-copy">
          <h2>Service access</h2>
          <p>
            Bins must be empty, safe to clean, and accessible at the scheduled
            service time. Full, blocked, hazardous, or unsafe bins may be
            rescheduled or refused.
          </p>
          <h2>Water use</h2>
          <p>
            At launch, Clean Curb Co. may use an exterior water spigot at the
            service address when needed. Water usage is minimal and may be
            recorded with an inline meter.
          </p>
          <h2>Wastewater</h2>
          <p>
            We use reasonable efforts to collect, manage, or redirect
            wastewater when appropriate and avoid intentional discharge into
            storm drains.
          </p>
          <h2>Weather and access</h2>
          <p>
            Service may be delayed or rescheduled due to weather, equipment
            issues, inaccessible bins, or unsafe conditions.
          </p>
          <h2>The Fresh Start Promise</h2>
          <p>
            If you are not happy, let us know within 24 hours and we will come
            back and make it right at no additional charge.
          </p>
          <p className="muted">{brand.legalNote}</p>
        </div>
      </section>
    </main>
  );
}
