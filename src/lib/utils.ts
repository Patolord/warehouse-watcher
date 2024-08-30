import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function milisecondsToDate(ms: number) {
  return new Date(ms).toLocaleDateString();
}

export function titleCase(string: string): string {
  const lowercaseWords = [
    "de",
    "da",
    "do",
    "para",
    "sem",
    "com",
    "em",
    "por",
    "na",
    "no",
    "nas",
    "nos",
    "as",
    "os",
    "mm",
    "cm",
    "kg",
    "ml",
    "km",
    "mg",
    "uma",
    "um",
    "uns",
  ];

  return string
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.length === 1 || lowercaseWords.includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ")
    .trim();
}
