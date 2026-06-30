import Link from "next/link";
import { PlaceholderPanel } from "@/components/placeholder-page";
import { adminFeatures } from "@/lib/site";

const adminLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Routes", href: "/admin/routes" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Services", href: "/admin/services" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "Settings", href: "/admin/settings" },
];

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="section section-cream">
      <div className="container shell-layout">
        <nav className="shell-nav" aria-label="Admin navigation">
          {adminLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        {children ?? (
          <PlaceholderPanel
            title={title}
            features={adminFeatures.slice(0, 6)}
            ctaHref="/admin/bookings"
            ctaLabel="View Mock Bookings"
          />
        )}
      </div>
    </main>
  );
}
