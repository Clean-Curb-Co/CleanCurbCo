import type { Metadata } from "next";
import { AdminShell } from "@/components/shells/admin-shell";
import { getAdminContext } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Admin Customers",
};

export default async function AdminCustomersPage() {
  const context = await getAdminContext("/admin/customers");

  return (
    <AdminShell title="Customer list" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Customers</p>
        <h1>Linked customer accounts.</h1>
        <div className="data-table">
          {context.profiles.map((profile) => {
            const bookings = context.bookings.filter(
              (booking) => booking.customer_id === profile.id,
            );
            const address = context.addresses.find(
              (item) => item.customer_id === profile.id,
            );

            return (
              <article className="data-row" key={profile.id}>
                <div>
                  <strong>
                    {[profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
                      profile.email ||
                      "Customer"}
                  </strong>
                  <span>{profile.email ?? "No email"} | {profile.phone ?? "No phone"}</span>
                </div>
                <span>{profile.role}</span>
                <span>{bookings.length} bookings</span>
                <span>{address?.neighborhood ?? "No address linked"}</span>
              </article>
            );
          })}
          {!context.profiles.length ? <p>No customer accounts yet.</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}
