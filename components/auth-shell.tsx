export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-12">
      <div className="absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-blue-600/35 blur-3xl" />
      <div className="absolute bottom-[-16rem] right-[-10rem] h-[38rem] w-[38rem] rounded-full bg-purple-600/35 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <section className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-glow backdrop-blur">
        {children}
      </section>
    </main>
  );
}
