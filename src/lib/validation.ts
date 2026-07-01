export function cleanString(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function cleanLongText(value: unknown, maxLength = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function cleanOptionalString(value: unknown, maxLength = 500) {
  const cleaned = cleanString(value, maxLength);
  return cleaned || null;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function cleanArray(value: unknown, maxItems = 12) {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .slice(0, maxItems)
        .map((item) => cleanString(item, 80))
        .filter(Boolean),
    ),
  );
}

export function parsePositiveInt(value: unknown, fallback = 1) {
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.max(1, Math.floor(numberValue));
}

export function mustBeTrue(value: unknown) {
  return value === true;
}

export function pickEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}
