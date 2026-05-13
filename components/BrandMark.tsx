export function BrandMark({ dark = false }: Readonly<{ dark?: boolean }>) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 via-blue-500 to-cyan-300 text-lg font-black text-white shadow-glow">
        OP
      </div>
      <div>
        <p className={`text-lg font-bold tracking-tight ${dark ? "text-slate-950" : "text-white"}`}>OpenPayd Portal</p>
        <p className={`text-xs uppercase tracking-[0.28em] ${dark ? "text-indigo-500" : "text-blue-200/70"}`}>Banking base</p>
      </div>
    </div>
  );
}
