import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";
import { addOns, recurringPlans } from "@/lib/site";
import { getAdminContext } from "@/lib/admin-data";
import { oneTimeRows } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin Services",
};

export default async function AdminServicesPage() {
  const context = await getAdminContext("/admin/services");

  return (
    <AdminShell title="Services and add-ons" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Services</p>
        <h1>Launch service catalog.</h1>
        <div className="grid grid-3">
          <article className="card">
            <h3>One-time cleaning</h3>
            {oneTimeRows.map((row) => (
              <p key={row.label}>
                {row.label}: <strong>{row.price}</strong>
              </p>
            ))}
          </article>
          {recurringPlans.map((plan) => (
            <article className="card" key={plan.id}>
              <h3>{plan.name}</h3>
              <p>
                {plan.frequency}: <strong>{plan.price}</strong>
                {plan.suffix}
              </p>
            </article>
          ))}
          {addOns.map((addOn) => (
            <article className="card" key={addOn.id}>
              <h3>{addOn.name}</h3>
              <p>
                {addOn.price}
                <br />
                {addOn.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
