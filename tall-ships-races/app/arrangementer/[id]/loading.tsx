// Skeleton som matcher detaljlayoutet i app/arrangementer/[id]/page.tsx.

export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite">
      {/* HERO */}
      <section className="bg-deep text-paper">
        <div className="mx-auto max-w-[1400px] px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
          <div className="h-7 w-28 rounded bg-paper/15" />
          <div className="mt-6 h-[clamp(2.75rem,8vw,7rem)] w-3/4 rounded bg-paper/15" />
          <div className="mt-8 grid gap-4 sm:grid-cols-[auto_auto] sm:gap-x-12">
            <div>
              <div className="h-3 w-12 rounded bg-paper/15" />
              <div className="mt-2 h-7 w-56 rounded bg-paper/15" />
            </div>
            <div>
              <div className="h-3 w-12 rounded bg-paper/15" />
              <div className="mt-2 h-7 w-40 rounded bg-paper/15" />
            </div>
          </div>
        </div>
      </section>

      {/* PRAKTISK */}
      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16">
          <div className="h-3 w-24 rounded bg-ink/15" />
          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-t border-ink/15 pt-4">
                <div className="h-3 w-20 rounded bg-ink/15" />
                <div className="mt-3 h-7 w-32 rounded bg-ink/10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OM */}
      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
          <div className="grid gap-8 md:grid-cols-12 md:gap-16">
            <div className="h-3 w-24 rounded bg-ink/15 md:col-span-3" />
            <div className="space-y-3 md:col-span-9">
              <div className="h-5 w-full rounded bg-ink/10" />
              <div className="h-5 w-11/12 rounded bg-ink/10" />
              <div className="h-5 w-3/4 rounded bg-ink/10" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
