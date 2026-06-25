import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

export function getCurrentDayHours(
  hours: { days: string; hours: string }[]
): { days: string; hours: string } | undefined {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = dayNames[new Date().getDay()];

  return hours.find((h) => {
    const range = h.days;
    if (range.includes("–")) {
      const [start, end] = range.split("–").map((d) => d.trim());
      const startIdx = dayNames.findIndex((d) => d.startsWith(start.slice(0, 3)));
      const endIdx = dayNames.findIndex((d) => d.startsWith(end.slice(0, 3)));
      const todayIdx = dayNames.indexOf(today);
      return todayIdx >= startIdx && todayIdx <= endIdx;
    }
    return range.includes(today);
  });
}
