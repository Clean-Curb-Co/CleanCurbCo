import type { Metadata } from "next";
import {
  AddOnsSection,
  FutureServicesSection,
  HowItWorksSection,
} from "@/components/sections/home-sections";
import { SectionHeader } from "@/components/section-header";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Residential garbage bin cleaning, sanitizing, deodorizing, and supportive outdoor add-ons in Cane Bay, SC.",
};

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container section-header">
          <p className="section-kicker">Services</p>
          <h1>Residential garbage bin cleaning first.</h1>
          <p>
            Clean Curb Co. launches with one flagship service: cleaner, fresher
            trash and recycling bins for Cane Bay neighbors.
          </p>
        </div>
      </section>
      <section className="section section-white">
        <div className="container">
          <SectionHeader
            kicker="Flagship service"
            title="Garbage bin cleaning, sanitizing, and deodorizing."
          >
            We help reduce odor, remove grime, refresh trash pads, and make the
            bins you avoid a little less dramatic.
          </SectionHeader>
        </div>
      </section>
      <HowItWorksSection />
      <AddOnsSection />
      <FutureServicesSection />
    </main>
  );
}
