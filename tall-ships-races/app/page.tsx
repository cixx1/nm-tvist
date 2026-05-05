import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Countdown from "@/components/Countdown";

// Forsiden er en server-komponent. Nedtellingen er klient-side
// (Countdown.tsx) slik at klokken ticker live i nettleseren.

const sections = [
  {
    nr: "01",
    href: "/skip",
    title: "Skip",
    teaser:
      "Åtte deltakerskip presenteres med klasse, lengde og hjemmehavn. Bla gjennom flåten før du går ned på kaia.",
  },
  {
    nr: "02",
    href: "/arrangementer",
    title: "Arrangementer",
    teaser:
      "Tolv programposter mellom 30. juli og 2. august. Konserter, omvisninger, workshops og seremonier.",
  },
  {
    nr: "03",
    href: "/kart",
    title: "Kart",
    teaser:
      "Bystranda, Lagholmen, Kilden, Odderøya, Christianholm og Tresse — vist på et felles kart.",
  },
];

const tickerItems = [
  "30 JUL — 02 AUG 2025",
  "KRISTIANSAND",
  "8 SKIP",
  "12 ARRANGEMENT",
  "GRATIS INNGANG",
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-deep text-paper">
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            alt="Tall Ships Races med skip på vei inn fjorden"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.18 0.04 245 / 0.55) 0%, oklch(0.18 0.04 245 / 0.35) 45%, oklch(0.10 0.03 245 / 0.85) 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col px-5 pt-24 pb-32 sm:px-8 sm:pt-32">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-paper/80">
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-lime" />
            Kristiansand · Klasse A til D
          </div>

          <h1 className="mt-8 max-w-[14ch] font-display text-[clamp(3.5rem,11vw,10rem)] font-black uppercase leading-[0.85] tracking-[-0.01em] text-paper sm:max-w-none">
            Tall Ships
            <br />
            <span className="inline-block">
              Races{" "}
              <span className="ml-2 inline-block translate-y-[-0.05em] text-lime">
                ’25
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-paper/85 sm:text-lg">
            Fire dager med store seilskip langs kaiene i Kristiansand. Åpent
            skip, konserter, workshops og en parade som du kan se fra land.
          </p>

          <div className="mt-auto pt-16">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-md">
                <p className="text-xs uppercase tracking-[0.25em] text-paper/70">
                  30. juli – 2. august 2025
                </p>
                <p className="mt-2 font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
                  Innseiling 12:00, åpning 18:00.
                </p>
              </div>
              <div className="w-full sm:max-w-md">
                <Countdown />
              </div>
            </div>
          </div>
        </div>

        {/* Lime ticker langs bunnen */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden bg-lime py-4 text-deep">
          <div className="ticker flex w-max whitespace-nowrap font-display text-xl uppercase tracking-wide sm:text-2xl">
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map(
              (item, i) => (
                <span key={i} className="diamond px-2">
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* INDEX / SEKSJONER */}
      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid gap-8 border-b border-ink/10 py-12 md:grid-cols-[1fr_auto] md:items-end md:gap-16 md:py-20">
            <h2 className="font-display text-[clamp(2.25rem,6vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
              Slik finner
              <br />
              du fram.
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-ink/70">
              Tre sider videre. Hvilke skip kommer, hva skjer når, og hvor i
              byen det skjer.
            </p>
          </div>

          <ul>
            {sections.map((s) => (
              <li
                key={s.href}
                className="border-b border-ink/10 last:border-b-0"
              >
                <Link
                  href={s.href}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-8 transition-colors hover:bg-cobalt hover:text-paper sm:gap-12 sm:py-12"
                >
                  <span className="font-display text-2xl tabular-nums tracking-tight sm:text-4xl">
                    {s.nr}
                  </span>
                  <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-12">
                    <h3 className="font-display text-3xl uppercase leading-none tracking-tight sm:text-6xl">
                      {s.title}
                    </h3>
                    <p className="max-w-md text-sm leading-relaxed text-ink/65 group-hover:text-paper/80 sm:text-base">
                      {s.teaser}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    size={28}
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* OM ARRANGEMENTET */}
      <section className="bg-cobalt text-paper">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-[0.25em] text-paper/70">
                Hva er Tall Ships Races
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] font-bold uppercase leading-[0.95]">
                Stor seilas, fem havner.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-paper/90 md:col-span-7 md:text-lg">
              <p>
                Tall Ships Races er en regatta for store seilskip og en
                havnefestival som flytter seg mellom byene som er med. I 2025
                går rekka fra Le Havre via Dunkirk og Aberdeen til Kristiansand,
                før den avsluttes i Esbjerg.
              </p>
              <p>
                Skipene seiler med ungdom om bord — målet med regattaen er at
                halvparten av mannskapet skal være mellom 15 og 25 år.
                Kristiansand er vert i fire dager, og alt på land er gratis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.25em] text-paper/60">
              Følg arrangementet
            </p>
            <p className="mt-3 font-display text-3xl uppercase leading-tight sm:text-5xl">
              Tall Ships Races
              <br />
              Kristiansand 2025
            </p>
          </div>

          <ul className="grid gap-3 text-sm sm:text-base">
            {[
              {
                tag: "IG",
                href: "https://www.instagram.com/tallshipsraceskristiansand/",
                handle: "@tallshipsraceskristiansand",
              },
              {
                tag: "FB",
                href: "https://www.facebook.com/tallshipsraceskristiansand",
                handle: "Tall Ships Races Kristiansand",
              },
              {
                tag: "TT",
                href: "https://www.tiktok.com/@tallshipsraceskrs",
                handle: "@tallshipsraceskrs",
              },
            ].map((s) => (
              <li key={s.tag}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-paper/85 hover:text-lime"
                >
                  <span className="grid h-6 w-6 place-items-center border border-paper/60 font-display text-[11px] font-bold tracking-wider">
                    {s.tag}
                  </span>
                  <span>{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-paper/15 pt-6 text-xs text-paper/55 sm:flex-row sm:justify-between">
          <p>Skoleprosjekt · Tangen VGS · IT-driftsfag VG2</p>
          <p>Cornelius og Elias · Mai 2025</p>
        </div>
      </div>
    </footer>
  );
}
