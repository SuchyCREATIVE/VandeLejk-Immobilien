"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/",           label: "Home" },
  { href: "/angebot",    label: "Mein Angebot" },
  { href: "/immobilien", label: "Erfolgsprojekte" },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/97 backdrop-blur-md shadow-[0_1px_0_0_rgba(201,192,179,0.4)]"
          : "bg-white shadow-[0_1px_0_0_rgba(201,192,179,0.25)]"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-[72px]">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo/VandeLejk-Logo-gray.svg"
            alt="VandeLejk Immobilien"
            width={140}
            height={40}
            priority
            unoptimized
          />
        </Link>

        {/* Desktop: Links + CTA */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-[10.5px] tracking-[0.22em] uppercase transition-colors duration-200 ${
                      active
                        ? "text-anthrazit border-b border-sand pb-0.5"
                        : "text-anthrazit-light hover:text-anthrazit"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-anthrazit transition-colors duration-300"
          >
            Kontakt <ArrowRight size={11} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-anthrazit p-1"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menü"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-t border-beige/60 ${
          mobileOpen ? "max-h-80 py-6" : "max-h-0"
        }`}
      >
        <ul className="px-6 flex flex-col gap-5 mb-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-[11px] tracking-[0.2em] uppercase transition-colors ${
                  pathname === link.href ? "text-anthrazit" : "text-anthrazit-light"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-6">
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 bg-anthrazit-dark text-white px-6 py-3 text-[10px] tracking-[0.2em] uppercase"
          >
            Kontakt aufnehmen <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </header>
  );
}
