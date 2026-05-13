"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.message ?? "Unable to sign in.");
      return;
    }

    router.push(result.user.role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <AuthShell>
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage balances and banking operations securely.</p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <Input label="Email" name="email" type="email" autoComplete="email" placeholder="you@openpayd.local" required />
        <Input label="Password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
        {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-400">Protected with HTTP-only cookies, JWT, bcrypt and role-based access.</p>
    </AuthShell>
  );
}
