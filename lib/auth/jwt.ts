import { SignJWT, jwtVerify } from "jose";
import type { Role, User } from "@prisma/client";
import type { SessionPayload } from "@/types/auth";

export const SESSION_COOKIE = "openpayd_session";
const ISSUER = "openpayd-portal";
const AUDIENCE = "openpayd-portal-users";
const TOKEN_TTL = "8h";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and contain at least 32 characters.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: Pick<User, "id" | "email" | "role" | "name" | "surname">) {
  return new SignJWT({
    email: user.email,
    role: user.role,
    name: user.name,
    surname: user.surname
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(TOKEN_TTL)
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    issuer: ISSUER,
    audience: AUDIENCE
  });

  if (!payload.sub || !payload.email || !payload.role || !payload.name || !payload.surname) {
    throw new Error("Invalid session payload.");
  }

  return {
    sub: payload.sub,
    email: String(payload.email),
    role: payload.role as Role,
    name: String(payload.name),
    surname: String(payload.surname)
  };
}
