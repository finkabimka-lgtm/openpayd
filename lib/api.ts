import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getSession, toAuthUser } from "@/lib/auth/session";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function requireUser(requiredRole?: Role) {
  const session = await getSession();
  if (!session) {
    return { error: jsonError("Authentication required.", 401) } as const;
  }

  if (requiredRole && session.role !== requiredRole) {
    return { error: jsonError("You are not allowed to access this resource.", 403) } as const;
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) {
    return { error: jsonError("Session user no longer exists.", 401) } as const;
  }

  if (requiredRole && user.role !== requiredRole) {
    return { error: jsonError("You are not allowed to access this resource.", 403) } as const;
  }

  return { user, authUser: toAuthUser(user) } as const;
}
