import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-anthrazit-dark text-white/60">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Image
              src="/logo/VandeLejk-Logo-white.svg"
              alt="VandeLejk Immobilien"
              width={148}
              height={42}
              className="mb-5"
            />
            <p className="text-sm leading-relaxed">
              Persönliche Immobilienberatung<br />
              in Hilden und Umgebung.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-[10px] tracking-[0.25em] uppercase mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/",           label: "Home" },
                { href: "/angebot",    label: "Mein Angebot" },
                { href: "/immobilien", label: "Immobilienangebote" },
                { href: "/kontakt",    label: "Kontakt" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-white text-[10px] tracking-[0.25em] uppercase mb-5">
              Kontakt
            </h4>
            <address className="text-sm not-italic leading-relaxed space-y-1">
              <p>VandeLejk Immobilien</p>
              <p>Vanessa Lejk</p>
              <p>Niedenstraße 113</p>
              <p>40721 Hilden</p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-5 text-[11px]">
          <p>© {new Date().getFullYear()} VandeLejk Immobilien – Vanessa Lejk</p>

          <div className="flex gap-6">
            <Link href="/impressum"   className="hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
          </div>

          {/* SuchyCREATIVE Signatur */}
          <a
            href="https://suchycreative.de"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://suchycreative.de/images/Logo/suchy-creative-logo-font-white.svg"
              alt="Webdesign by SuchyCREATIVE"
              className="h-6"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
