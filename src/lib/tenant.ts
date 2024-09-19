import { PrismaClient } from "@prisma/client";

const clients: { [key: string]: PrismaClient | undefined } = {};

export async function createTenantPrismaClient(dbName: string) {
  if (!clients[dbName]) {
    clients[dbName] = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://postgres:12345@localhost:5432/${dbName}`,
        },
      },
    });
  }
  return clients[dbName];
}

export async function disconnectTenantPrismaClient(dbName: string) {
  const client = clients[dbName];

  if (client) {
    await client.$disconnect();
    delete clients[dbName];
  }
}

export function getTenantPrismaClient(dbName: string): PrismaClient | null {
  if (!clients[dbName]) {
    return null;
  }
  return clients[dbName] || null;
}

export function logTenantPrismaClients() {
  console.log("clients");
  const clientsData = Object.keys(clients);
  console.log(clientsData);
  console.log("clients length");
  console.log(clientsData.length);
  console.log("clients loop ...");
  Object.entries(clients).forEach(([key, value]) => {
    console.log(`Key: ${key}, Value:`, value ? "Connected" : "Disconnected");
  });
}
