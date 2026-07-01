import type { Metadata } from "next";
import {
  endBreakAction,
  readyForNextStopAction,
  startBreakAction,
} from "@/app/field/actions";
import { FieldShell } from "@/components/shells/field-shell";
import { humanizeStatus } from "@/lib/booking-utils";
import { getFieldContext } from "@/lib/field-data";

export const metadata: Metadata = {
  title: "Field Breaks",
};

type FieldBreaksPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

const breakReasons = [
  ["lunch", "Lunch"],
  ["bathroom", "Bathroom"],
  ["tank_empty", "Tank empty"],
  ["tank_refill", "Tank refill"],
  ["equipment_issue", "Equipment issue"],
  ["fuel_stop", "Fuel stop"],
  ["weather_pause", "Weather pause"],
  ["customer_delay", "Customer delay"],
  ["other", "Other"],
] as const;

export default async function FieldBreaksPage({
  searchParams,
}: FieldBreaksPageProps) {
  const params = await searchParams;
  const context = await getFieldContext("/field/breaks");
  const routeStopId = params.routeStopId ?? "";
  const activeBreak = context.breaks.find(
    (routeBreak) =>
      !routeBreak.ended_at &&
      context.auth.status === "ok" &&
      routeBreak.technician_id === context.auth.userId,
  );
  const activeRouteDay = context.routeDays.find(
    (routeDay) => routeDay.id === activeBreak?.route_day_id,
  );
  const openRoutes = context.routeDays.filter((routeDay) =>
    ["planned", "active"].includes(routeDay.status),
  );

  return (
    <FieldShell title="Breaks" auth={context.auth}>
      {activeBreak ? (
        <section className="field-card">
          <span className="status-badge status-in_progress">On Break</span>
          <h2>{humanizeStatus(activeBreak.reason)}</h2>
          <p>
            Started {new Date(activeBreak.started_at).toLocaleTimeString()} on{" "}
            {activeRouteDay?.route_name ?? activeRouteDay?.route_date ?? "route"}.
          </p>
          {activeBreak.notes ? <p className="field-note">{activeBreak.notes}</p> : null}
          <form action={endBreakAction} className="field-form">
            <input type="hidden" name="breakId" value={activeBreak.id} />
            <input type="hidden" name="routeStopId" value={routeStopId} />
            <label className="inline-check">
              <input type="checkbox" name="readyForNext" defaultChecked={Boolean(routeStopId)} />
              <span>Ready for next stop after ending break</span>
            </label>
            <button className="button button-primary" type="submit">
              End Break
            </button>
          </form>
        </section>
      ) : (
        <section className="field-card">
          <p className="section-kicker">Start Break</p>
          <h2>Pause the route flow.</h2>
          <p>Breaks do not notify the next customer. Resume when ready.</p>
          <form action={startBreakAction} className="field-form">
            <label>
              Route
              <select name="routeDayId" defaultValue={openRoutes[0]?.id ?? ""}>
                <option value="">No route selected</option>
                {openRoutes.map((routeDay) => (
                  <option key={routeDay.id} value={routeDay.id}>
                    {routeDay.route_date} - {routeDay.route_name ?? routeDay.service_area}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Reason
              <select name="reason" defaultValue="lunch">
                {breakReasons.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Notes
              <textarea name="notes" placeholder="Optional internal note" />
            </label>
            <button className="button button-dark" type="submit">
              Start Break
            </button>
          </form>
        </section>
      )}

      <section className="field-list">
        {context.breaks.slice(0, 12).map((routeBreak) => (
          <article className="field-card compact-field-card" key={routeBreak.id}>
            <div className="field-card-top">
              <span className={`status-badge status-${routeBreak.ended_at ? "completed" : "in_progress"}`}>
                {routeBreak.ended_at ? "Ended" : "Active"}
              </span>
              <span>{new Date(routeBreak.started_at).toLocaleString()}</span>
            </div>
            <h2>{humanizeStatus(routeBreak.reason)}</h2>
            <p>
              Ended:{" "}
              {routeBreak.ended_at
                ? new Date(routeBreak.ended_at).toLocaleTimeString()
                : "Still running"}
            </p>
          </article>
        ))}
      </section>

      {routeStopId && !activeBreak ? (
        <form action={readyForNextStopAction} className="field-floating-action">
          <input type="hidden" name="routeStopId" value={routeStopId} />
          <button className="button button-primary" type="submit">
            Ready for Next Stop
          </button>
        </form>
      ) : null}
    </FieldShell>
  );
}
