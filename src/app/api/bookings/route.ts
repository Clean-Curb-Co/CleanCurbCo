import { NextResponse } from "next/server";
import { calculateEstimatedPrice } from "@/lib/pricing";
import type {
  BookingRequest,
  SchedulingPreference,
  ServiceFrequency,
} from "@/types/booking";

type IncomingBooking = Omit<
  BookingRequest,
  "id" | "createdAt" | "status" | "payment" | "photos" | "internalNotes"
>;

const validFrequencies: ServiceFrequency[] = [
  "one_time",
  "monthly",
  "every_other_month",
  "quarterly",
];

const validScheduling: SchedulingPreference[] = [
  "next_available_route_day",
  "specific_day",
  "urgent",
];

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<IncomingBooking>;
  const frequency = normalizeFrequency(body.service?.frequency);
  const binCount = normalizeBinCount(body.service?.binCount);
  const addOns = Array.isArray(body.service?.addOns) ? body.service.addOns : [];

  const booking: BookingRequest = {
    id: `ccc-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    status: "new",
    customer: {
      firstName: cleanString(body.customer?.firstName),
      lastName: cleanString(body.customer?.lastName),
      phone: cleanString(body.customer?.phone),
      email: cleanString(body.customer?.email),
      serviceAddress: cleanString(body.customer?.serviceAddress),
      neighborhood: cleanString(body.customer?.neighborhood),
    },
    service: {
      binCount,
      binTypes: Array.isArray(body.service?.binTypes)
        ? body.service.binTypes.map(cleanString).filter(Boolean)
        : [],
      frequency,
      addOns,
      estimatedPrice: calculateEstimatedPrice({
        binCount,
        frequency,
        addOns,
      }),
    },
    scheduling: {
      preference: normalizeScheduling(body.scheduling?.preference),
      requestedDate: cleanString(body.scheduling?.requestedDate) || undefined,
      confirmedRouteDay: undefined,
    },
    instructions: {
      binLocation: cleanString(body.instructions?.binLocation) || "Curbside",
      waterSpigotAvailable:
        body.instructions?.waterSpigotAvailable === "no" ||
        body.instructions?.waterSpigotAvailable === "not_sure"
          ? body.instructions.waterSpigotAvailable
          : "yes",
      notes: cleanString(body.instructions?.notes) || undefined,
    },
    agreements: {
      waterUse: Boolean(body.agreements?.waterUse),
      binCondition: Boolean(body.agreements?.binCondition),
      wastewater: Boolean(body.agreements?.wastewater),
      weatherAccess: Boolean(body.agreements?.weatherAccess),
      photos: Boolean(body.agreements?.photos),
      payment: Boolean(body.agreements?.payment),
    },
    payment: {
      status: "not_sent",
    },
  };

  // TODO: Persist booking, trigger SMS/email confirmations, and create payment
  // links through the selected provider once backend credentials are available.
  return NextResponse.json(
    {
      booking,
      message:
        "Thanks! Your request has been received. We will text you shortly to confirm your Cane Bay route day and final price.",
    },
    { status: 201 },
  );
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBinCount(value: unknown) {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? Math.max(1, Math.floor(numberValue)) : 1;
}

function normalizeFrequency(value: unknown): ServiceFrequency {
  return validFrequencies.includes(value as ServiceFrequency)
    ? (value as ServiceFrequency)
    : "one_time";
}

function normalizeScheduling(value: unknown): SchedulingPreference {
  return validScheduling.includes(value as SchedulingPreference)
    ? (value as SchedulingPreference)
    : "next_available_route_day";
}
