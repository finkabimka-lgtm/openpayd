export function Card({ children, className = "" }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/20 backdrop-blur ${className}`}>
      {children}
    </section>
  );
}
