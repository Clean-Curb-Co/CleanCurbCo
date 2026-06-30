import Link from "next/link";
import { PlaceholderPanel } from "@/components/placeholder-page";
import { portalFeatures } from "@/lib/site";

const portalLinks = [
  { label: "Overview", href: "/portal" },
  { label: "Bookings", href: "/portal/bookings" },
  { label: "Plan", href: "/portal/subscription" },
  { label: "Billing", href: "/portal/billing" },
  { label: "Photos", href: "/portal/photos" },
  { label: "Referrals", href: "/portal/referrals" },
];

export function PortalShell({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="section section-cream">
      <div className="container shell-layout">
        <nav className="shell-nav" aria-label="Customer portal navigation">
          {portalLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        {children ?? (
          <PlaceholderPanel
            title={title}
            features={portalFeatures.slice(0, 6)}
            ctaHref="/book"
            ctaLabel="Book a Cleaning"
          />
        )}
      </div>
    </main>
  );
}
