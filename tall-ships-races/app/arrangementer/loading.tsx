// Skeleton som matcher listing-layoutet i app/arrangementer/page.tsx.

export default function Loading() {
  return (
    <main className="bg-paper text-ink" aria-busy="true" aria-live="polite">
      <section className="bg-deep text-paper">
        <div className="mx-auto max-w-[1400px] px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
          <div className="h-3 w-44 rounded bg-paper/20" />
          <div className="mt-6 h-[clamp(3rem,9vw,8rem)] w-1/2 rounded bg-paper/15" />
          <div className="mt-6 h-4 w-2/5 rounded bg-paper/15" />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col gap-5 border-b border-ink/10 py-8 sm:py-10">
          <div>
            <div className="h-3 w-12 rounded bg-ink/10" />
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-20 animate-pulse rounded-full bg-ink/10"
                />
              ))}
            </div>
          </div>
          <div>
            <div className="h-3 w-12 rounded bg-ink/10" />
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-24 animate-pulse rounded-full bg-ink/10"
                />
              ))}
            </div>
          </div>
        </div>

        {Array.from({ length: 2 }).map((_, dayIdx) => (
          <div
            key={dayIdx}
            className="border-b border-ink/10 py-12 last:border-b-0 sm:py-16"
          >
            <div className="h-10 w-2/3 rounded bg-ink/15" />
            <ol className="mt-8 border-t border-ink/15">
              {Array.from({ length: 3 }).map((_, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-8 border-b border-ink/15 py-8"
                >
                  <div className="h-9 w-16 rounded bg-ink/10" />
                  <div>
                    <div className="h-4 w-32 rounded bg-ink/10" />
                    <div className="mt-3 h-7 w-2/3 rounded bg-ink/15" />
                  </div>
                  <div className="h-3 w-24 rounded bg-ink/10" />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </main>
  );
}
