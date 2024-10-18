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

export function handleBigInt(result: any) {
  return JSON.parse(
    JSON.stringify(result, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

const sqlKeywords = [
  "select",
  "from",
  "where",
  "insert",
  "into",
  "update",
  "delete",
  "create",
  "drop",
  "alter",
  "join",
  "left",
  "right",
  "inner",
  "outer",
  "on",
  "and",
  "or",
  "group",
  "by",
  "order",
  "limit",
  "offset",
  "between",
  "as",
  "having",
  "distinct",
];

export const convertToUpperCase = (query: string) => {
  const regex = new RegExp(`\\b(${sqlKeywords.join("|")})\\b`, "gi");
  return query.replace(regex, (match) => match.toUpperCase());
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
