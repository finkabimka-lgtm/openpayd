import { cn } from "@/lib/utils";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-azure to-orchid text-lg font-black text-white shadow-lg">
        OP
      </div>
      <div>
        <p className={cn("text-lg font-black tracking-tight", inverted ? "text-white" : "text-slate-950")}>OpenPayd</p>
        <p className={cn("text-xs font-semibold uppercase tracking-[0.28em]", inverted ? "text-blue-100" : "text-blue-600")}>Portal</p>
      </div>
    </div>
  );
}
