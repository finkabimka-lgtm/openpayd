import { NextResponse } from "next/server";
import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireUser, jsonError } from "@/lib/api";
import { updateCustomerSchema } from "@/lib/validation/user";
import { toAuthUser } from "@/lib/auth/session";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { rejectCrossSiteMutation } from "@/lib/security/csrf";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const csrfError = rejectCrossSiteMutation(request);
  if (csrfError) return csrfError;

  const admin = await requireUser(Role.ADMIN);
  if ("error" in admin) return admin.error;

  const limiter = rateLimit(`admin-update:${admin.user.id}:${getClientIp(request)}`, 60, 60_000);
  if (!limiter.allowed) return jsonError("Too many balance updates.", 429);

  const parsed = updateCustomerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Please provide a valid balance.", 422);

  try {
    const user = await prisma.user.update({
      where: { id: params.id, role: Role.CUSTOMER },
      data: { balance: new Prisma.Decimal(parsed.data.balance) }
    });

    return NextResponse.json({ user: toAuthUser(user) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonError("Customer not found.", 404);
    }
    throw error;
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const csrfError = rejectCrossSiteMutation(request);
  if (csrfError) return csrfError;

  const admin = await requireUser(Role.ADMIN);
  if ("error" in admin) return admin.error;

  const limiter = rateLimit(`admin-delete:${admin.user.id}:${getClientIp(request)}`, 30, 60_000);
  if (!limiter.allowed) return jsonError("Too many delete requests.", 429);

  try {
    await prisma.user.delete({ where: { id: params.id, role: Role.CUSTOMER } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonError("Customer not found.", 404);
    }
    throw error;
  }
}
