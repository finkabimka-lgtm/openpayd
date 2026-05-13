import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/api";
import { toAuthUser } from "@/lib/auth/session";

export async function GET() {
  const admin = await requireUser(Role.ADMIN);
  if ("error" in admin) return admin.error;

  const users = await prisma.user.findMany({
    where: { role: Role.CUSTOMER },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ users: users.map(toAuthUser) });
}
