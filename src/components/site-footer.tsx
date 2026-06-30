import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { brand } from "@/lib/site";

const footerLinks = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Book", href: "/book" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Customer Portal", href: "/portal" },
  { label: "Admin", href: "/admin" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="grid">
            <BrandLogo />
            <p className="muted">
              Locally owned | Veteran owned | Eco-conscious
              <br />
              Now serving {brand.area}
            </p>
            <p className="muted">
              {brand.phone}
              <br />
              {brand.email}
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {footerLinks.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="footer-small">
          {brand.legalNote} Public-facing service is provided under the Clean
          Curb Co. brand. Payment, route scheduling, and portal features are
          being built in stages.
        </p>
      </div>
    </footer>
  );
}
