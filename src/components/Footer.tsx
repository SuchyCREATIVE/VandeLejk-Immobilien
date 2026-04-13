import Link from "next/link";
import Image from "next/image";

function IconInstagram({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconFacebook({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function IconLinkedin({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

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
            <p className="text-sm leading-relaxed mb-6">
              Persönliche Immobilienberatung<br />
              in Hilden und Umgebung.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/vandelejk_immobilien/"
                target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <IconInstagram size={17} />
              </a>
              <a
                href="https://www.facebook.com/vanessa.lejk"
                target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <IconFacebook size={17} />
              </a>
              <a
                href="https://www.linkedin.com/in/vanessa-lejk-b9a099221/"
                target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <IconLinkedin size={17} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-[10px] tracking-[0.25em] uppercase mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/",        label: "Home" },
                { href: "/angebot", label: "Mein Angebot" },
                { href: "/kontakt", label: "Kontakt" },
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
          <p>© {new Date().getFullYear()} VandeLejk Immobilien</p>

          <div className="flex gap-6">
            <Link href="/impressum"   className="hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
