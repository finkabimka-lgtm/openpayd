import { NextResponse } from "next/server";
import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireUser, jsonError } from "@/lib/api";
import { createCustomerSchema } from "@/lib/validation/user";
import { hashPassword } from "@/lib/auth/password";
import { toAuthUser } from "@/lib/auth/session";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { rejectCrossSiteMutation } from "@/lib/security/csrf";

export async function POST(request: Request) {
  const csrfError = rejectCrossSiteMutation(request);
  if (csrfError) return csrfError;

  const admin = await requireUser(Role.ADMIN);
  if ("error" in admin) return admin.error;

  const limiter = rateLimit(`admin-create:${admin.user.id}:${getClientIp(request)}`, 30, 60_000);
  if (!limiter.allowed) return jsonError("Too many customer creation requests.", 429);

  const parsed = createCustomerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Please provide valid customer details.", 422);

  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        surname: parsed.data.surname,
        email: parsed.data.email.toLowerCase(),
        password: await hashPassword(parsed.data.password),
        role: Role.CUSTOMER,
        balance: new Prisma.Decimal(parsed.data.balance)
      }
    });

    return NextResponse.json({ user: toAuthUser(user) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError("A user with this email already exists.", 409);
    }
    throw error;
  }
}
