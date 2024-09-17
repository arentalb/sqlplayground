import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/getAuth";

export async function GET() {
  const authData = await getAuth();
  const { user } = authData;
  const minimalUserData = user
    ? {
        id: user.id,
        username: user.username,
        role: user.role,
      }
    : null;

  return NextResponse.json({ user: minimalUserData });
}
