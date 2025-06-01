import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const emojiToUnicode = (emoji: string) => {
  return Array.from(emoji)
    .map((c) => c.codePointAt(0)!.toString(16).toUpperCase())
    .join("-");
};
