import Link from "next/link";
import { Construction, Sparkles } from "lucide-react";

type PlaceholderPageProps = {
  title: string;
  description?: string;
  features?: string[];
  ctaHref?: string;
  ctaLabel?: string;
};

export function PlaceholderPage({
  ...props
}: PlaceholderPageProps) {
  return (
    <main className="section section-cream placeholder-page">
      <div className="container">
        <PlaceholderPanel {...props} />
      </div>
    </main>
  );
}

export function PlaceholderPanel({
  title,
  description = "This area is coming soon. For now, book online or contact us and we will help directly.",
  features = [],
  ctaHref = "/book",
  ctaLabel = "Book a Cleaning",
}: PlaceholderPageProps) {
  return (
    <div className="placeholder-panel">
      <span className="icon-box">
        <Construction size={24} aria-hidden="true" />
      </span>
      <p className="section-kicker">Coming Soon</p>
      <h1>{title}</h1>
      <p>{description}</p>
      {features.length ? (
        <div className="grid grid-3">
          {features.map((feature) => (
            <article className="card" key={feature}>
              <Sparkles size={20} aria-hidden="true" />
              <h3>{feature}</h3>
              <p>Planned Feature</p>
            </article>
          ))}
        </div>
      ) : null}
      <Link className="button button-dark" href={ctaHref}>
        {ctaLabel}
      </Link>
    </div>
  );
}
