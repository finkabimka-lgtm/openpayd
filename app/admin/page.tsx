"use client";

import { FormEvent, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatEUR, fullName } from "@/lib/format";
import type { AuthUser } from "@/types/auth";

export default function AdminPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    const response = await fetch("/api/admin/users");
    if (response.status === 401 || response.status === 403) {
      window.location.href = "/login";
      return;
    }
    const result = await response.json();
    setUsers(result.users ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        surname: formData.get("surname"),
        email: formData.get("email"),
        password: formData.get("password"),
        balance: formData.get("balance")
      })
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.message ?? "Could not create customer.");
      return;
    }

    form.reset();
    setMessage("Customer created successfully.");
    await loadUsers();
  }

  async function updateBalance(userId: string, balance: string) {
    setError("");
    setMessage("");
    const response = await fetch(`/api/admin/user/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ balance })
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.message ?? "Could not update balance.");
      return;
    }

    setUsers((current) => current.map((user) => (user.id === userId ? result.user : user)));
    setMessage("Balance updated.");
  }

  async function deleteUser(userId: string) {
    setError("");
    setMessage("");
    const response = await fetch(`/api/admin/user/${userId}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      setError(result.message ?? "Could not delete customer.");
      return;
    }

    setUsers((current) => current.filter((user) => user.id !== userId));
    setMessage("Customer deleted.");
  }

  return (
    <DashboardShell>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Admin panel</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Customer operations</h1>
        <p className="mt-2 text-slate-500">Create customers, review balances, and maintain account access.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <form className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-card" onSubmit={createUser}>
          <h2 className="text-2xl font-black text-slate-950">Create customer</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input label="Name" name="name" required />
            <Input label="Surname" name="surname" required />
          </div>
          <div className="mt-4 space-y-4">
            <Input label="Email" name="email" type="email" required />
            <Input label="Password" name="password" type="password" minLength={8} required />
            <Input label="Balance in EUR" name="balance" type="number" min="0" step="0.01" required />
          </div>
          {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
          {message ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p> : null}
          <Button className="mt-6 w-full" type="submit">Create customer</Button>
        </form>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card">
          <div className="border-b border-slate-100 p-7">
            <h2 className="text-2xl font-black text-slate-950">Customers</h2>
            <p className="mt-1 text-sm text-slate-500">Passwords are never returned by the API.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td className="px-6 py-5 text-slate-500" colSpan={4}>Loading customers...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td className="px-6 py-5 text-slate-500" colSpan={4}>No customers yet.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-5 font-semibold text-slate-900">{fullName(user)}</td>
                      <td className="px-6 py-5 text-slate-600">{user.email}</td>
                      <td className="px-6 py-5">
                        <BalanceEditor user={user} onSave={updateBalance} />
                      </td>
                      <td className="px-6 py-5">
                        <Button variant="danger" className="px-3 py-2" onClick={() => deleteUser(user.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function BalanceEditor({ user, onSave }: { user: AuthUser; onSave: (id: string, balance: string) => Promise<void> }) {
  const [balance, setBalance] = useState(String(user.balance));

  useEffect(() => {
    setBalance(String(user.balance));
  }, [user.balance]);

  return (
    <div className="flex items-center gap-2">
      <input
        className="w-28 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        type="number"
        min="0"
        step="0.01"
        value={balance}
        aria-label={`Balance for ${fullName(user)} currently ${formatEUR(user.balance)}`}
        onChange={(event) => setBalance(event.target.value)}
      />
      <Button className="px-3 py-2" variant="secondary" onClick={() => onSave(user.id, balance)}>Save</Button>
    </div>
  );
}
