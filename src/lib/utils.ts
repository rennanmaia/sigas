import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidCpf(value: string) {
  const v = String(value).replace(/\D/g, "");
  if (v.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(v)) return false;

  const digits = v.split("").map((d) => Number(d));

  const calc = (slice: number) => {
    let sum = 0;
    for (let i = 0; i < slice; i++) {
      sum += digits[i] * (slice + 1 - i);
    }
    const res = (sum * 10) % 11;
    return res === 10 ? 0 : res;
  };

  const v1 = calc(9);
  const v2 = calc(10);
  return v1 === digits[9] && v2 === digits[10];
}

/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5; // Maximum number of page buttons to show
  const rangeWithDots = [];

  if (totalPages <= maxVisiblePages) {
    // If total pages is 5 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i);
    }
  } else {
    // Always show first page
    rangeWithDots.push(1);

    if (currentPage <= 3) {
      // Near the beginning: [1] [2] [3] [4] ... [10]
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push("...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end: [1] ... [7] [8] [9] [10]
      rangeWithDots.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i);
      }
    } else {
      // In the middle: [1] ... [4] [5] [6] ... [10]
      rangeWithDots.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push("...", totalPages);
    }
  }

  return rangeWithDots;
}
