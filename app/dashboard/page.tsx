import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { DashboardShell } from "@/components/dashboard-shell";
import { formatEUR, fullName } from "@/lib/format";
import { requireUser } from "@/lib/api";

export default async function CustomerDashboardPage() {
  const result = await requireUser(Role.CUSTOMER);
  if ("error" in result) {
    redirect("/login");
  }

  const user = result.authUser;

  return (
    <DashboardShell>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Customer dashboard</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Hello {fullName(user)}</h1>
        <p className="mt-2 text-slate-500">Your OpenPayd account overview is ready.</p>
      </div>

      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-card">
          <div className="absolute right-[-5rem] top-[-6rem] h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">Available balance</p>
          <p className="mt-6 text-5xl font-black tracking-tight">{formatEUR(user.balance)}</p>
          <div className="mt-10 flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <div>
              <p className="text-xs text-blue-100">Account holder</p>
              <p className="font-semibold">{fullName(user)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-100">Currency</p>
              <p className="font-semibold">EUR</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Coming next</p>
          <h2 className="mt-4 text-2xl font-black text-slate-950">Banking modules</h2>
          <ul className="mt-6 space-y-4 text-sm text-slate-600">
            <li>• Transactions and statements</li>
            <li>• Cards and spend controls</li>
            <li>• Transfers and IBAN management</li>
            <li>• KYC and compliance workflows</li>
          </ul>
        </div>
      </section>
    </DashboardShell>
  );
}
