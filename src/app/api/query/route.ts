import { NextResponse } from "next/server";
import { getPrismaClientForUser } from "@/lib/utils";

export async function POST(request: Request) {
  console.log("in post function of query ");

  const { database_name, query } = await request.json();

  const prisma = getPrismaClientForUser(database_name);
  try {
    const result = await prisma.$queryRawUnsafe(query);
    return NextResponse.json({ success: "true", result: result });
  } catch (error) {
    console.error("Error executing query: ", error);
    return NextResponse.json({ error: "Failed to execute query" });
  }
}
