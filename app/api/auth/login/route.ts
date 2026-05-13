import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createSessionToken, SESSION_COOKIE, toAuthUser } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { jsonError } from "@/lib/api";
import { loginSchema } from "@/lib/validation/user";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { rejectCrossSiteMutation } from "@/lib/security/csrf";

export async function POST(request: Request) {
  const csrfError = rejectCrossSiteMutation(request);
  if (csrfError) return csrfError;

  const ip = getClientIp(request);
  const limiter = rateLimit(`login:${ip}`, 10, 60_000);
  if (!limiter.allowed) {
    return jsonError("Too many login attempts. Please try again shortly.", 429);
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("Please provide a valid email and password.", 422);
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() }
  });

  if (!user) {
    return jsonError("Invalid email or password.", 401);
  }

  const passwordMatches = await verifyPassword(parsed.data.password, user.password);
  if (!passwordMatches) {
    return jsonError("Invalid email or password.", 401);
  }

  const token = await createSessionToken(user);
  const response = NextResponse.json({ user: toAuthUser(user) });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
