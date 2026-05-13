import { cookies } from "next/headers";
import type { User } from "@prisma/client";
import type { AuthUser } from "@/types/auth";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/jwt";

export { createSessionToken, SESSION_COOKIE, verifySessionToken } from "@/lib/auth/jwt";

export async function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    balance: Number(user.balance),
    createdAt: user.createdAt.toISOString()
  };
}
