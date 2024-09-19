import { NextResponse } from "next/server";
import { getPrismaClientForUser } from "@/lib/utils";

export async function POST(request: Request) {
  console.log("in connect ");
  try {
    const { database_name } = await request.json();
    getPrismaClientForUser(database_name);
    return NextResponse.json({ message: "Connected successfully" });
  } catch (error) {
    console.error("Error connecting to database:", error);
    return NextResponse.json({ error: "Failed to connect to database" });
  }
}
