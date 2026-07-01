import type { Metadata } from "next";
import { PortalShell } from "@/components/shells/portal-shell";
import { getPortalContext } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Portal Photos",
};

export default async function PortalPhotosPage() {
  const context = await getPortalContext("/portal/photos");
  const visitsWithPhotos = context.visits.filter(
    (visit) =>
      (visit.before_photo_urls?.length ?? 0) ||
      (visit.after_photo_urls?.length ?? 0),
  );

  return (
    <PortalShell title="Before and after photos" auth={context.auth}>
      <section className="placeholder-panel">
        <p className="section-kicker">Photos</p>
        <h1>Before and after proof.</h1>
        {visitsWithPhotos.length ? (
          <div className="grid grid-2">
            {visitsWithPhotos.map((visit) => (
              <article className="card" key={visit.id}>
                <h3>{visit.route_day ?? "Completed visit"}</h3>
                <p>
                  Before photos: {visit.before_photo_urls?.length ?? 0}
                  <br />
                  After photos: {visit.after_photo_urls?.length ?? 0}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p>
            Service photos will appear here after completed cleanings. For now,
            they may also arrive by text or email.
          </p>
        )}
      </section>
    </PortalShell>
  );
}
