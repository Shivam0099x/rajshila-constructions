import { DeliveryStatus } from "@/types";

/**
 * Calculates human-readable duration between two ISO date strings or Date objects.
 */
export function calculateDuration(start: string | Date, end: string | Date): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "N/A";
  }

  const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  }

  const months = Math.floor(diffDays / 30.4375);
  const remainingDays = Math.round(diffDays % 30.4375);

  if (months < 12) {
    if (remainingDays >= 7) {
      const weeks = Math.round(remainingDays / 7);
      return `${months} ${months === 1 ? "month" : "months"}, ${weeks} ${weeks === 1 ? "week" : "weeks"}`;
    }
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  const years = (diffDays / 365.25).toFixed(1);
  return `${years.endsWith(".0") ? years.slice(0, -2) : years} years (${months} months)`;
}

/**
 * Calculates delivery status for completed projects:
 * - "Early": Completed before client-agreed expected date (by > 3 days)
 * - "On Time": Completed within 3 days of agreed date
 * - "Delayed": Completed after agreed date
 */
export function calculateDeliveryStatus(
  expectedDateStr: string | Date,
  actualDateStr?: string | Date
): DeliveryStatus {
  if (!actualDateStr) return "On Time";

  const expected = new Date(expectedDateStr);
  const actual = new Date(actualDateStr);

  if (isNaN(expected.getTime()) || isNaN(actual.getTime())) {
    return "On Time";
  }

  // Calculate day difference (actual - expected)
  const diffTime = actual.getTime() - expected.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  // If actual was finished at least 4 days before expected
  if (diffDays < -3) {
    return "Early";
  }
  // If actual was within +/- 3 days of expected
  if (diffDays <= 3) {
    return "On Time";
  }
  // Completed later than expected
  return "Delayed";
}

/**
 * Formats a date string for display (e.g., "Nov 2024" or "15 Nov 2024")
 */
export function formatDate(dateStr?: string | Date, includeDay: boolean = false): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
    ...(includeDay ? { day: "numeric" } : {}),
  });
}
