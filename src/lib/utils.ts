import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPostgresErrorText = ({
  message = "No Message",
  code = "No Code",
}: {
  message?: string;
  code?: string;
}): string => {
  // Default values in case message or code is undefined
  const safeMessage = message ?? "No Message";
  const safeCode = code ?? "No Code";

  return [`Code: ${safeCode}`, `Message: ${safeMessage}`].join("\n");
};
