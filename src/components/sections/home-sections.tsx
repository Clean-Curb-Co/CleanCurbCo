import Link from "next/link";
import {
  BadgeCheck,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Droplets,
  Flag,
  HeartHandshake,
  Home,
  Leaf,
  MapPin,
  MessageSquareText,
  Route,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Trash2,
} from "lucide-react";
import { FAQAccordion } from "@/components/faq-accordion";
import { PricingCard } from "@/components/pricing-card";
import { SectionHeader } from "@/components/section-header";
import { ServiceCard } from "@/components/service-card";
import {
  addOns,
  futureServices,
  oneTimeRows,
  recurringPlans,
  serviceAreas,
} from "@/lib/site";

export function ProblemSection() {
  const problems = [
    "Smelly bins",
    "Flies and maggots",
    "Garage odors",
    "Sticky residue",
    "Dirty trash pads",
    "Bacteria and grime",
  ];

  return (
    <section className="section section-dark">
      <div className="container grid grid-2">
        <div>
          <SectionHeader
            kicker="The problem"
            title="Trash day should not stink all week."
          >
            We clean, sanitize, and deodorize the bins you would rather not
            touch. Fair enough. Nobody dreams of scrubbing a trash can.
          </SectionHeader>
          <Link className="button button-primary" href="/book">
            <Sparkles size={20} aria-hidden="true" />
            Get a Fresh Start
          </Link>
        </div>
        <ul className="problem-list">
          {problems.map((problem) => (
            <li key={problem}>
              <CheckCircle2 size={19} aria-hidden="true" />
              {problem}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      title: "Book online",
      body: "Choose your bins, plan, and add-ons in a couple of minutes.",
    },
    {
      title: "Leave bins accessible",
      body: "Curbside, driveway, side of garage, or another agreed location.",
    },
    {
      title: "We clean and send proof",
      body: "We wash, sanitize, deodorize, and send before/after photos.",
    },
  ];

  return (
    <section className="section section-white">
      <div className="container">
        <SectionHeader
          kicker="How it works"
          title="Ridiculously easy, as trash-can chores should be."
        >
          Book once, get route-day confirmation by text, and let the grime meet
          its match.
        </SectionHeader>
        <div className="grid grid-3">
          {steps.map((step, index) => (
            <article className="card" key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="section section-cream" id="pricing">
      <div className="container">
        <div className="promo-strip">
          <p className="section-kicker">Founding Neighbor Special</p>
          <h2>
            Get your first 2-bin cleaning for <strong>$25</strong> when you
            join any recurring plan.
          </h2>
          <p>
            Limited launch offer for Cane Bay neighbors joining a recurring
            route.
          </p>
        </div>
        <SectionHeader kicker="Pricing" title="Simple pricing. Cleaner bins.">
          We clean by neighborhood route to keep service affordable, reliable,
          and efficient. Extra recurring bins are typically +$8-$10 each.
        </SectionHeader>
        <div className="grid grid-4">
          <article className="card pricing-card">
            <span className="plan-badge">One-Time Clean</span>
            <div>
              <h3>One-Time Clean</h3>
              <p>Great for a reset, move-in, or the bin that went rogue.</p>
            </div>
            <ul className="check-list">
              {oneTimeRows.map((row) => (
                <li key={row.label}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>
                    {row.label}: <strong>{row.price}</strong>
                  </span>
                </li>
              ))}
            </ul>
            <Link className="button button-dark" href="/book">
              Book One-Time
            </Link>
          </article>
          {recurringPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              label={plan.label}
              name={plan.name}
              price={plan.price}
              suffix={plan.suffix}
              frequency={plan.frequency}
              highlights={plan.highlights}
              featured={plan.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AddOnsSection() {
  const icons = [SprayCan, Sparkles, Trash2, Droplets, Home];

  return (
    <section className="section section-white">
      <div className="container">
        <SectionHeader kicker="Add-ons" title="Helpful extras for outdoor messes.">
          We solve dirty, smelly, outdoor problems. Starting-at services get a
          final price confirmed before service.
        </SectionHeader>
        <div className="grid grid-3">
          {addOns.map((addOn, index) => (
            <ServiceCard
              key={addOn.id}
              icon={icons[index] ?? Sparkles}
              title={`${addOn.name} | ${addOn.price}`}
              description={addOn.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceAreaSection() {
  return (
    <section className="section section-dark">
      <div className="container service-area-panel">
        <div>
          <SectionHeader kicker="Service area" title="Now Serving Cane Bay">
            We&apos;re starting in Cane Bay so we can build reliable
            neighborhood routes, keep pricing fair, and serve customers without
            long delays.
          </SectionHeader>
          <div className="hero-actions">
            <Link className="button button-primary" href="/book">
              Join Cane Bay Route
            </Link>
            <Link className="button button-secondary" href="/contact">
              Join Waitlist
            </Link>
          </div>
        </div>
        <ul className="route-list">
          {serviceAreas.map((area) => (
            <li key={area}>
              <MapPin size={18} aria-hidden="true" />
              {area}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WhyChooseUsSection() {
  const cards = [
    {
      icon: MapPin,
      title: "Local",
      description: "Built for Cane Bay and nearby Summerville communities.",
    },
    {
      icon: Flag,
      title: "Veteran-owned",
      description: "A disciplined, service-first approach without the corporate feel.",
    },
    {
      icon: Leaf,
      title: "Eco-conscious",
      description: "Practical products and wastewater care whenever possible.",
    },
    {
      icon: MessageSquareText,
      title: "Clear communication",
      description: "Texts for confirmation, reminders, updates, and completion.",
    },
    {
      icon: Camera,
      title: "Before/after photos",
      description: "Proof that your bins got the fresh-start treatment.",
    },
    {
      icon: ShieldCheck,
      title: "Satisfaction promise",
      description: "Let us know within 24 hours and we will make it right.",
    },
    {
      icon: Route,
      title: "Route-based pricing",
      description: "Neighborhood routes help keep visits efficient and affordable.",
    },
    {
      icon: HeartHandshake,
      title: "Friendly service",
      description: "Professional, neighborly, and only lightly amused by bin drama.",
    },
  ];

  return (
    <section className="section section-cream">
      <div className="container">
        <SectionHeader kicker="Why choose us" title="Clean bins, clear texts, no weirdness.">
          The customer experience is designed around one thought: that was
          ridiculously easy.
        </SectionHeader>
        <div className="grid grid-4">
          {cards.map((card) => (
            <ServiceCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FreshStartPromiseSection() {
  return (
    <section className="section promise-band">
      <div className="container promise-card">
        <p className="section-kicker">The Fresh Start Promise</p>
        <h2>If you are not happy, we will come back and make it right.</h2>
        <p>
          Let us know within 24 hours and we will return at no additional
          charge. Clean bins should feel simple, reliable, and worth it.
        </p>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="section section-white" id="faq">
      <div className="container">
        <SectionHeader kicker="FAQ" title="Quick answers before trash day.">
          If your question is not here, send it over. We are building this to be
          easy for real neighbors, not imaginary perfect customers.
        </SectionHeader>
        <FAQAccordion />
      </div>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section className="section final-cta">
      <div className="container">
        <SectionHeader
          kicker="Ready?"
          title="Ready for a fresh start at the curb?"
        >
          Join the Cane Bay route and let trash day stop following you back to
          the garage.
        </SectionHeader>
        <div className="hero-actions">
          <Link className="button button-primary" href="/book">
            <CalendarIcon />
            Book Now
          </Link>
          <Link className="button button-secondary" href="/book">
            <BadgeCheck size={20} aria-hidden="true" />
            Join Cane Bay Route
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FutureServicesSection() {
  return (
    <section className="section section-dark">
      <div className="container">
        <SectionHeader
          kicker="Future services"
          title="More outdoor cleanups are on the roadmap."
        >
          Launch focus stays on residential garbage bin cleaning. These services
          are planned for later as the route and equipment base grows.
        </SectionHeader>
        <div className="grid grid-3">
          {futureServices.map((service) => (
            <article className="card dark-card" key={service}>
              <span className="status-badge">Coming Soon</span>
              <h3>{service}</h3>
              <p>Available later as routes, equipment, and neighborhood demand grow.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalendarIcon() {
  return <ClipboardCheck size={20} aria-hidden="true" />;
}
