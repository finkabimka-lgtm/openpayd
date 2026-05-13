export function BackgroundGlow({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950 text-slate-100">
      <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="absolute bottom-[-16rem] right-[-8rem] h-[36rem] w-[36rem] rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute left-[-12rem] top-1/3 h-[28rem] w-[28rem] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
