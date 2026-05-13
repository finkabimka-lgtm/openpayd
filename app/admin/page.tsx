import { Role } from "@prisma/client";
import { logoutAction } from "@/app/actions";
import { createCustomerAction, deleteCustomerAction, updateBalanceAction } from "@/app/admin/actions";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import { formatEUR } from "@/lib/format";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const customers = await prisma.user.findMany({
    where: { role: Role.CUSTOMER },
    orderBy: { createdAt: "desc" },
  });

  return (
    <BackgroundGlow>
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <div className="flex items-center gap-4">
            <p className="text-sm text-blue-100/70">Signed in as {admin.email}</p>
            <form action={logoutAction}>
              <Button className="px-4 py-2" type="submit">Logout</Button>
            </form>
          </div>
        </header>

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/80">Admin workspace</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Manage customers</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-blue-100/75">
            Create customer accounts, adjust balances, and remove demo customers in a simple base architecture.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <Card className="bg-white text-slate-950">
            <h2 className="text-2xl font-bold">Create customer</h2>
            <form action={createCustomerAction} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <label className="block text-sm font-medium text-slate-700">
                  Name
                  <TextInput className="mt-2" name="name" placeholder="Mario" required />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Surname
                  <TextInput className="mt-2" name="surname" placeholder="Rossi" required />
                </label>
              </div>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <TextInput className="mt-2" name="email" placeholder="customer@openpayd.local" required type="email" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Password
                <TextInput className="mt-2" name="password" placeholder="Temporary password" required type="password" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Balance
                <TextInput className="mt-2" min="0" name="balance" placeholder="1000.00" required step="0.01" type="number" />
              </label>
              <Button className="w-full" type="submit">Create customer</Button>
            </form>
          </Card>

          <Card className="overflow-hidden bg-white p-0 text-slate-950">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-2xl font-bold">Customer list</h2>
              <p className="mt-2 text-sm text-slate-500">{customers.length} customer account{customers.length === 1 ? "" : "s"}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Current balance</th>
                    <th className="px-6 py-4">Edit balance</th>
                    <th className="px-6 py-4">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <tr className="transition hover:bg-slate-50" key={customer.id}>
                      <td className="px-6 py-4 font-semibold">{customer.name} {customer.surname}</td>
                      <td className="px-6 py-4 text-slate-500">{customer.email}</td>
                      <td className="px-6 py-4 font-bold text-indigo-600">{formatEUR(customer.balance)}</td>
                      <td className="px-6 py-4">
                        <form action={updateBalanceAction} className="flex items-center gap-2">
                          <input name="id" type="hidden" value={customer.id} />
                          <TextInput className="w-32 py-2" defaultValue={customer.balance.toString()} name="balance" step="0.01" type="number" />
                          <Button className="px-3 py-2" type="submit">Save</Button>
                        </form>
                      </td>
                      <td className="px-6 py-4">
                        <form action={deleteCustomerAction}>
                          <input name="id" type="hidden" value={customer.id} />
                          <button className="rounded-xl border border-red-200 px-3 py-2 font-semibold text-red-600 transition hover:bg-red-50" type="submit">
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </BackgroundGlow>
  );
}
