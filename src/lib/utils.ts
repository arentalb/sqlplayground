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

type JSONData = { [key: string]: any };

interface TableData {
  columns: string[];
  rows: any[][];
}

export const extractTableData = (data: string): TableData => {
  let jsonData: JSONData[] = [];

  try {
    jsonData = JSON.parse(data);
  } catch (error) {
    return { columns: [], rows: [] };
  }

  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return { columns: [], rows: [] };
  }

  const columns: string[] = Object.keys(jsonData[0]);

  const rows: any[][] = jsonData.map((item) => {
    return typeof item === "object" && item !== null ? Object.values(item) : [];
  });

  return { columns, rows };
};

export const canConvertToTable = (data: string): boolean => {
  if (!data || data.length === 0) {
    return false;
  }

  let jsonData;

  try {
    jsonData = JSON.parse(data);
  } catch (error) {
    return false;
  }

  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return false;
  }

  const firstObjectKeys = Object.keys(jsonData[0]);

  return jsonData.every((item) => {
    if (typeof item !== "object" || item === null) {
      return false;
    }

    const currentObjectKeys = Object.keys(item);
    return (
      currentObjectKeys.length === firstObjectKeys.length &&
      currentObjectKeys.every((key) => firstObjectKeys.includes(key))
    );
  });
};

export function checkDatabaseName(dbName: string) {
  const dbNameRegex = /^[a-zA-Z0-9_]+$/;
  return dbNameRegex.test(dbName);
}
