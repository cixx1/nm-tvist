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

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

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
          className="font-display text-base font-black uppercase tracking-[0.18em] text-paper"
          aria-label="Forsiden"
        >
          TSR <span className="text-lime">Kristiansand</span>
        </Link>

        <nav className="hidden md:block" aria-label="Hovedmeny">
          <ul className="flex items-center gap-2 lg:gap-3">
            {links.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "block bg-lime px-4 py-2 font-display text-sm font-black uppercase tracking-[0.12em] text-deep"
                        : "block px-4 py-2 font-display text-sm font-black uppercase tracking-[0.12em] text-paper underline-offset-[6px] decoration-2 decoration-lime hover:underline"
                    }
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
          className="flex h-11 w-11 items-center justify-center border border-paper/30 text-paper transition-colors hover:border-lime hover:text-lime md:hidden"
        >
          {open ? (
            <X size={22} strokeWidth={1.8} />
          ) : (
            <Menu size={22} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {open ? (
        <nav
          aria-label="Hovedmeny"
          className="border-y border-paper/20 bg-deep md:hidden"
        >
          <ul>
            {links.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li
                  key={l.href}
                  className="border-b border-paper/15 last:border-b-0"
                >
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "block bg-lime px-5 py-5 font-display text-3xl font-black uppercase tracking-tight text-deep"
                        : "block px-5 py-5 font-display text-3xl font-black uppercase tracking-tight text-paper hover:bg-paper/5"
                    }
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
