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
    "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at",
    "to", "from", "by", "in", "of", "with", "under", "over", "as"
  ];

  return string
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index === 0 || !lowercaseWords.includes(word)
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ")
    .trim();
}
