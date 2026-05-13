"use server";

import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function readRequired(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createCustomerAction(formData: FormData) {
  await requireAdmin();

  const name = readRequired(formData, "name");
  const surname = readRequired(formData, "surname");
  const email = readRequired(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const balance = Number(readRequired(formData, "balance") || 0);

  if (!name || !surname || !email || !password || Number.isNaN(balance)) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      surname,
      email,
      password: hashedPassword,
      role: Role.CUSTOMER,
      balance,
    },
  });

  revalidatePath("/admin");
}

export async function updateBalanceAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const balance = Number(formData.get("balance"));

  if (!Number.isInteger(id) || Number.isNaN(balance)) {
    return;
  }

  await prisma.user.updateMany({
    where: { id, role: Role.CUSTOMER },
    data: { balance },
  });

  revalidatePath("/admin");
}

export async function deleteCustomerAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    return;
  }

  await prisma.user.deleteMany({ where: { id, role: Role.CUSTOMER } });
  revalidatePath("/admin");
}
