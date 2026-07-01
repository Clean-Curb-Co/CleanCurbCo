import type { BookingRow, RequestType, ServiceVisitRow } from "@/types/database";

export type PolicyWindow = "standard" | "within_48_hours" | "within_24_hours";
export type CancellationPolicyStatus =
  | "none"
  | "fee_may_apply"
  | "full_charge_may_apply";

export const servicePolicyConfig = {
  timezone: "America/New_York",
  defaultServiceHourLocal: 8,
  cancellationFeeWithin48Hours: 10,
  fullChargeWithin24Hours: true,
};

export const policyReasoningText =
  "Routes, prep work, supplies, and scheduling are planned before service day. Last-minute changes can still create real costs even if service is cancelled or rescheduled.";

export const policyWindowLabels: Record<PolicyWindow, string> = {
  standard: "Standard",
  within_48_hours: "Within 48 Hours",
  within_24_hours: "Within 24 Hours",
};

export const requestTypeLabels: Record<RequestType, string> = {
  pause_service: "Pause Service",
  cancel_service: "Cancel Service",
  reschedule_service: "Reschedule Service",
  change_frequency: "Change Frequency",
  update_address: "Update Service Address",
  add_service: "Add Services",
  drop_service: "Drop Services",
  request_add_on: "Request Add-On",
  billing_question: "Billing Question",
  general_help: "General Help",
};

export function getBookingServiceDate(
  booking?: Pick<BookingRow, "confirmed_route_day" | "requested_date"> | null,
  visits: Array<Pick<ServiceVisitRow, "booking_id" | "route_day" | "status">> = [],
) {
  if (!booking) return null;

  const visit = visits.find(
    (item) =>
      item.route_day &&
      !["completed", "skipped", "cancelled"].includes(item.status),
  );

  return booking.confirmed_route_day ?? visit?.route_day ?? booking.requested_date ?? null;
}

export function evaluatePolicyWindow(serviceDate: string | null, now = new Date()): PolicyWindow {
  if (!serviceDate) return "standard";

  const serviceAt = dateInBusinessTimezone(serviceDate);
  const diffMs = serviceAt.getTime() - now.getTime();

  if (diffMs <= 24 * 60 * 60 * 1000) return "within_24_hours";
  if (diffMs <= 48 * 60 * 60 * 1000) return "within_48_hours";
  return "standard";
}

export function requiresTypedAcknowledgment(
  requestType: RequestType,
  policyWindow: PolicyWindow,
) {
  if (policyWindow === "within_24_hours") {
    return isHighImpactRequest(requestType);
  }

  if (policyWindow === "within_48_hours") {
    return ["cancel_service", "drop_service"].includes(requestType);
  }

  return false;
}

export function isHighImpactRequest(requestType: RequestType) {
  return [
    "pause_service",
    "cancel_service",
    "reschedule_service",
    "change_frequency",
    "update_address",
    "add_service",
    "drop_service",
    "request_add_on",
  ].includes(requestType);
}

export function getCancellationFee(
  requestType: RequestType,
  policyWindow: PolicyWindow,
) {
  if (requestType === "cancel_service" && policyWindow === "within_48_hours") {
    return servicePolicyConfig.cancellationFeeWithin48Hours;
  }

  return null;
}

export function getFullChargeApplies(
  requestType: RequestType,
  policyWindow: PolicyWindow,
) {
  return (
    servicePolicyConfig.fullChargeWithin24Hours &&
    policyWindow === "within_24_hours" &&
    isHighImpactRequest(requestType)
  );
}

export function getCancellationPolicyStatus(
  requestType: RequestType,
  policyWindow: PolicyWindow,
): CancellationPolicyStatus {
  if (getFullChargeApplies(requestType, policyWindow)) {
    return "full_charge_may_apply";
  }

  if (getCancellationFee(requestType, policyWindow) !== null) {
    return "fee_may_apply";
  }

  return "none";
}

export function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function namesMatch(typedName: string, validNames: string[]) {
  const normalized = normalizeName(typedName);
  return Boolean(normalized) && validNames.some((name) => normalizeName(name) === normalized);
}

function dateInBusinessTimezone(dateValue: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const parsed = new Date(dateValue);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const localUtcGuess = Date.UTC(
    year,
    month - 1,
    day,
    servicePolicyConfig.defaultServiceHourLocal,
  );
  const firstOffset = getTimezoneOffsetMs(new Date(localUtcGuess));
  const firstUtc = localUtcGuess - firstOffset;
  const secondOffset = getTimezoneOffsetMs(new Date(firstUtc));

  return new Date(localUtcGuess - secondOffset);
}

function getTimezoneOffsetMs(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: servicePolicyConfig.timezone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return asUtc - date.getTime();
}
