import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, DollarSign } from "lucide-react";
import { brand } from "@/lib/site";
import {
  AddOnsSection,
  FAQSection,
  FinalCTASection,
  FreshStartPromiseSection,
  HowItWorksSection,
  PricingSection,
  ProblemSection,
  ServiceAreaSection,
  WhyChooseUsSection,
} from "@/components/sections/home-sections";

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <Image
          src="/clean-curb-hero.png"
          alt="Two curbside garbage bins being washed with clean water."
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-scrim" />
        <div className="container hero-content">
          <Image
            src="/clean-curb-logo.png"
            alt={brand.logoAlt}
            width={132}
            height={132}
            className="hero-logo"
            priority
          />
          <p className="eyebrow">Clean Curb Co. | Cane Bay, SC</p>
          <h1>Fresh Starts at the Curb.</h1>
          <p className="hero-subtitle">
            Professional garbage bin cleaning in Cane Bay and nearby
            Summerville communities.
          </p>
          <p className="trust-line">
            Locally owned | Veteran owned | Eco-conscious
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/book">
              <CalendarCheck size={20} aria-hidden="true" />
              Book Now
            </Link>
            <Link className="button button-secondary" href="#pricing">
              <DollarSign size={20} aria-hidden="true" />
              See Pricing
            </Link>
          </div>
          <p className="hero-note">
            Stink happens. We handle it.
            <ArrowRight size={18} aria-hidden="true" />
          </p>
        </div>
      </section>

      <ProblemSection />
      <HowItWorksSection />
      <PricingSection />
      <AddOnsSection />
      <ServiceAreaSection />
      <WhyChooseUsSection />
      <FreshStartPromiseSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
}
