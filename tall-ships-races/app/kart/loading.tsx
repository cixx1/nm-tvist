// Skeleton som matcher kart-layoutet.

export default function Loading() {
  return (
    <main className="bg-paper text-ink" aria-busy="true" aria-live="polite">
      <section className="bg-deep text-paper">
        <div className="mx-auto max-w-[1400px] px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-20">
          <div className="h-3 w-32 rounded bg-paper/20" />
          <div className="mt-6 h-[clamp(3rem,9vw,8rem)] w-3/4 rounded bg-paper/15" />
          <div className="mt-6 h-4 w-2/5 rounded bg-paper/15" />
        </div>
      </section>

      <div className="h-[70vh] min-h-[600px] w-full bg-deep">
        <div className="flex h-full items-center justify-center">
          <span className="font-display text-sm uppercase tracking-[0.25em] text-paper/70">
            Laster kart…
          </span>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-8 border-b border-ink/10 pb-12 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
          <div className="h-[clamp(2.25rem,6vw,4.5rem)] w-2/3 rounded bg-ink/10" />
          <div className="h-3 w-72 rounded bg-ink/10" />
        </div>
        <ul className="mt-8 grid gap-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="border-t border-ink/15 pt-8">
              <div className="grid gap-8 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-5">
                  <div className="h-3 w-24 rounded bg-ink/10" />
                  <div className="mt-3 h-12 w-2/3 rounded bg-ink/10" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-ink/10" />
                  <div className="mt-5 h-3 w-3/4 rounded bg-ink/10" />
                </div>
                <div className="md:col-span-7">
                  <div className="h-3 w-32 rounded bg-ink/10" />
                  <div className="mt-4 h-12 w-full rounded bg-ink/10" />
                  <div className="mt-2 h-12 w-full rounded bg-ink/10" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
