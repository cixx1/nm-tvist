// Skeleton som matcher detaljlayoutet i app/skip/[id]/page.tsx.

export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite">
      {/* HERO */}
      <section className="bg-deep text-paper">
        <div className="mx-auto max-w-[1400px] px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
          <div className="h-7 w-24 rounded-full bg-paper/15" />
          <div className="mt-6 h-[clamp(3.25rem,11vw,10rem)] w-2/3 rounded bg-paper/15" />
          <div className="mt-4 h-6 w-1/3 rounded bg-paper/15" />
        </div>
      </section>

      {/* FAKTA */}
      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="h-3 w-12 rounded bg-ink/15" />
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="border-t border-ink/15 pt-4">
                <div className="h-3 w-16 rounded bg-ink/15" />
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
            <div className="h-3 w-16 rounded bg-ink/15 md:col-span-3" />
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
