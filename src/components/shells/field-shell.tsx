import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { requireField, type AuthResult } from "@/lib/supabase/auth";

const fieldLinks = [
  { label: "Today", href: "/field/today" },
  { label: "Routes", href: "/field/routes" },
  { label: "Breaks", href: "/field/breaks" },
  { label: "History", href: "/field/history" },
];

export async function FieldShell({
  title,
  children,
  auth,
}: {
  title: string;
  children?: React.ReactNode;
  auth?: AuthResult;
}) {
  const currentAuth = auth ?? (await requireField("/field/today"));

  if (currentAuth.status !== "ok") {
    return (
      <main className="section section-cream">
        <div className="container shell-layout">
          <section className="placeholder-panel">
            <p className="section-kicker">Field App</p>
            <h1>{title}</h1>
            <p>{currentAuth.message}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="field-app">
      <div className="field-shell">
        <header className="field-header">
          <div>
            <p className="section-kicker">Clean Curb Co.</p>
            <h1>{title}</h1>
          </div>
          <LogoutButton />
        </header>
        <nav className="field-nav" aria-label="Field app navigation">
          {fieldLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </main>
  );
}
