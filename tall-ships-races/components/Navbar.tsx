"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Hjem" },
  { href: "/skip", label: "Skip" },
  { href: "/arrangementer", label: "Arrangementer" },
  { href: "/kart", label: "Kart" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Reset under render når ruten endres — Reacts anbefalte mønster
  // for å derive state fra props/context uten ekstra effect-pass.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Escape-lytter mens menyen er åpen. setOpen-kallet skjer i en
  // ekstern callback (ikke synkront i effect-bodyen) — det er trygt.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
        <Link
          href="/"
          className="font-display text-base uppercase tracking-[0.18em] text-paper"
          aria-label="Forsiden"
        >
          TSR <span className="text-lime">Kristiansand</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border border-paper/25 bg-paper/10 p-1 backdrop-blur-md">
            {links.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block rounded-full px-4 py-2 text-sm tracking-wide transition-colors ${
                      active
                        ? "bg-paper text-deep"
                        : "text-paper hover:bg-paper/15"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Lukk meny" : "Åpne meny"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 bg-paper/10 text-paper backdrop-blur-md md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mx-5 mt-3 rounded-3xl border border-paper/20 bg-deep/95 p-2 backdrop-blur-md md:hidden">
          <ul className="flex flex-col">
            {links.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block rounded-2xl px-4 py-3 text-base tracking-wide ${
                      active ? "bg-paper text-deep" : "text-paper"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
