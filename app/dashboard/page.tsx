import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { formatEUR } from "@/lib/format";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  if (user.role === Role.ADMIN) {
    redirect("/admin");
  }

  return (
    <BackgroundGlow>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <BrandMark />
          <form action={logoutAction}>
            <Button className="bg-none px-4 py-2" type="submit">
              Logout
            </Button>
          </form>
        </header>

        <section className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/80">Customer dashboard</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Hello {user.name} {user.surname}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/75">
              This simple portal shows a live balance loaded from PostgreSQL. Use it as a clean starting point for future banking features.
            </p>
          </div>

          <Card className="relative overflow-hidden bg-white text-slate-950">
            <div className="absolute right-[-4rem] top-[-4rem] h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl" />
            <p className="text-sm font-medium text-slate-500">Available balance</p>
            <p className="mt-5 text-5xl font-black tracking-tight text-slate-950">{formatEUR(user.balance)}</p>
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-navy-900 to-indigo-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">OpenPayd EUR Account</p>
              <p className="mt-6 text-lg font-semibold">{user.name} {user.surname}</p>
              <p className="mt-1 text-sm text-blue-100/70">Base project account</p>
            </div>
          </Card>
        </section>
      </div>
    </BackgroundGlow>
  );
}
