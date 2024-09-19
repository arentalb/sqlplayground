"use server";

import {
  createTenantPrismaClient,
  disconnectTenantPrismaClient,
  getTenantPrismaClient,
} from "@/lib/tenant";
import { formatPostgresErrorText } from "@/lib/utils";

export async function connectToTenantDatabase(databaseName: string) {
  try {
    await createTenantPrismaClient(databaseName);
    return { message: "Connected successfully" };
  } catch (error) {
    console.error("Error connecting to database:", error);
    return { error: "Failed to connect to database" };
  }
}

export async function disconnectFromTenantDatabase(databaseName: string) {
  try {
    await disconnectTenantPrismaClient(databaseName);
    return { message: "Disconnected successfully" };
  } catch (error) {
    console.error("Error disconnecting from database:", error);
    return { error: "Failed to disconnect from database" };
  }
}

export async function executeTenantDatabaseQuery(
  databaseName: string,
  query: string,
) {
  const prisma = getTenantPrismaClient(databaseName);
  try {
    if (!prisma) {
      return { error: "No connection found" };
    }
    const result = await prisma.$queryRawUnsafe(query);
    return { success: true, result: JSON.stringify(result) };
  } catch (error) {
    const updatedError = {
      // @ts-expect-error "i know what field it returns"
      message: error?.meta?.message,
      // @ts-expect-error "i know what field it returns"
      code: error?.meta?.code,
    };
    return { error: formatPostgresErrorText(updatedError) };
  }
}
