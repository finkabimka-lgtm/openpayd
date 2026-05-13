"use server";

import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { createSession, destroySession, loginWithPassword } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const user = await loginWithPassword(email, password);

  if (!user) {
    return { error: "Invalid email or password." };
  }

  createSession(user.id);

  if (user.role === Role.ADMIN) {
    redirect("/admin");
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  destroySession();
  redirect("/");
}
