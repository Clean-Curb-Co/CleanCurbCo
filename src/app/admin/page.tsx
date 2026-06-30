import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";

export const metadata: Metadata = {
  title: "Admin",
  description: "Future Clean Curb Co. admin portal.",
};

const mockRows = [
  ["CCC-1001", "Lindera Preserve", "New booking"],
  ["CCC-1002", "The Oaks", "Route confirmation needed"],
  ["CCC-1003", "Cane Bay Plantation", "Payment link not sent"],
];

export default function AdminPage() {
  return (
    <AdminShell title="Admin portal">
      <section className="placeholder-panel">
        <p className="section-kicker">Admin preview</p>
        <h1>Route operations dashboard</h1>
        <p>
          Mock data for the future booking, customer, route, payment, and
          review workflows.
        </p>
        <div className="mock-table">
          {mockRows.map(([id, neighborhood, status]) => (
            <div className="mock-row" key={id}>
              <strong>{id}</strong>
              <span>{neighborhood}</span>
              <span>{status}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
