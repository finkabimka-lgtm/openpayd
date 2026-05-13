import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/logout-button";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-midnight px-6 py-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.45),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(124,58,237,0.45),transparent_30%)]" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between">
          <Logo inverted />
          <LogoutButton />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </main>
  );
}
