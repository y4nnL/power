import { format, parseISO } from "date-fns";

export function formatDate(value: string | Date, pattern = "PPP") {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, pattern);
}

export function formatLoad(value?: number | null, unit: "kg" | "lb" = "kg") {
  if (value == null) return "-";
  const normalized = unit === "lb" ? value * 2.20462 : value;
  return `${normalized.toFixed(1)} ${unit}`;
}

export function percent(value: number, fractionDigits = 0) {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}
