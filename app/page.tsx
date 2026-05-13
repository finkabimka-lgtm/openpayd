import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { BrandMark } from "@/components/BrandMark";
import { LoginForm } from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user?.role === Role.ADMIN) {
    redirect("/admin");
  }

  if (user?.role === Role.CUSTOMER) {
    redirect("/dashboard");
  }

  return (
    <BackgroundGlow>
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_440px]">
          <section className="hidden lg:block">
            <BrandMark />
            <h1 className="mt-10 max-w-xl text-5xl font-bold leading-tight tracking-tight text-white">
              Banking operations with a calm, modern fintech experience.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100/75">
              A minimal full-stack base with Prisma, PostgreSQL, simple cookie sessions, customer balances, and admin controls.
            </p>
            <div className="mt-8 flex gap-3 text-sm text-blue-100/80">
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">PostgreSQL</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">Prisma ORM</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">Next.js 14</span>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-8 text-slate-950 shadow-2xl shadow-black/30 sm:p-10">
            <div className="lg:hidden">
              <BrandMark dark />
            </div>
            <div className="mt-8 lg:mt-0">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-500">Welcome back</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Sign in to your portal</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Use the seeded admin or Mario Rossi customer account to explore the base project.
              </p>
            </div>
            <LoginForm />
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-500">
              <p>Admin: admin@openpayd.local / Admin123!</p>
              <p>Customer: mario@openpayd.local / Mario123!</p>
            </div>
          </section>
        </div>
      </div>
    </BackgroundGlow>
  );
}
