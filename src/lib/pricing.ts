import { addOns } from "@/lib/site";
import type { ServiceFrequency } from "@/types/booking";

type PriceInput = {
  binCount: number;
  frequency: ServiceFrequency;
  addOns: string[];
};

const recurringBase: Record<ServiceFrequency, number> = {
  one_time: 0,
  monthly: 25,
  every_other_month: 30,
  quarterly: 35,
};

export function calculateBasePrice(binCount: number, frequency: ServiceFrequency) {
  const safeBinCount = Math.max(1, binCount);

  if (frequency === "one_time") {
    if (safeBinCount === 1) return 25;
    if (safeBinCount === 2) return 35;
    if (safeBinCount === 3) return 45;
    return 45 + (safeBinCount - 3) * 10;
  }

  const extraBins = Math.max(0, safeBinCount - 2);
  return recurringBase[frequency] + extraBins * 8;
}

export function calculateEstimatedPrice(input: PriceInput) {
  const addOnTotal = input.addOns.reduce((total, addOnId) => {
    const addOn = addOns.find((item) => item.id === addOnId);
    return total + (addOn?.estimate ?? 0);
  }, 0);

  return calculateBasePrice(input.binCount, input.frequency) + addOnTotal;
}

export function formatFrequency(frequency: ServiceFrequency) {
  const labels: Record<ServiceFrequency, string> = {
    one_time: "One-Time Clean",
    monthly: "Fresh Routine - Monthly",
    every_other_month: "Most Popular - Every Other Month",
    quarterly: "Seasonal Fresh Start - Quarterly",
  };

  return labels[frequency];
}
