"use server";

import {
  checkAvailabilityTenantPrismaClient,
  createTenantPrismaClient,
  disconnectTenantPrismaClient,
  getTenantPrismaClient,
} from "@/lib/tenant";
import { delay, formatPostgresErrorText } from "@/lib/utils";
import { storeSqlCodeInHistory } from "@/actions/history.action";

export async function connectToTenantDatabase(databaseName: string) {
  try {
    await delay(1000);
    await createTenantPrismaClient(databaseName);
    return { message: "Connected successfully" };
  } catch (error) {
    console.error("Error connecting to database:", error);
    return { error: "Failed to connect to database" };
  }
}

export async function disconnectFromTenantDatabase(databaseName: string) {
  try {
    await delay(1000);
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
  projectId: string,
) {
  const prisma = getTenantPrismaClient(databaseName);
  try {
    if (!prisma) {
      return { error: "No connection found" };
    }
    const result = await prisma.$queryRawUnsafe(query);
    await storeSqlCodeInHistory(projectId, query, "SUCCESS");
    return { success: true, result: JSON.stringify(result) };
  } catch (error) {
    const updatedError = {
      // @ts-expect-error "i know what field it returns"
      message: error?.meta?.message,
      // @ts-expect-error "i know what field it returns"
      code: error?.meta?.code,
    };
    await storeSqlCodeInHistory(projectId, query, "ERROR");
    return { error: formatPostgresErrorText(updatedError) };
  }
}

export async function isConnectionAlive(databaseName: string) {
  return checkAvailabilityTenantPrismaClient(databaseName);
}
