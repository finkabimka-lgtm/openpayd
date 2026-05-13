import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { rejectCrossSiteMutation } from "@/lib/security/csrf";

export async function POST(request: Request) {
  const csrfError = rejectCrossSiteMutation(request);
  if (csrfError) return csrfError;

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0
  });

  return response;
}
