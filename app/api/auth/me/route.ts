import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api";

export async function GET() {
  const result = await requireUser();
  if ("error" in result) return result.error;

  return NextResponse.json({ user: result.authUser });
}
