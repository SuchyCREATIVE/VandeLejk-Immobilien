# CLAUDE.md – vandelejk-immobilien

## Projekt
- Kunde: VandeLejk Immobilien – Vanessa Lejk
- Branche: Immobilien
- Live-Domain: vandelejk-immobilien.de
- Vorschau: https://vandelejk-immobilien.scpreview.de
- GitHub: https://github.com/SuchyCREATIVE/VandeLejk-Immobilien

## Tech-Stack
- Next.js 16 (App Router) + TypeScript
- TailwindCSS v4 (Konfig: globals.css @theme Block – KEINE tailwind.config.ts!)
- Framer Motion, Lucide-React
- Prisma 7 + SQLite
  ⚠ Import: @/generated/prisma (NICHT @prisma/client)
- NextAuth v5 (beta)
- Nodemailer (SMTP)
- react-hook-form + zod
- bcryptjs (Passwörter)
- sharp (Bildrotation)

## Wichtige Hinweise
- ⚠ Prisma 7: `prisma.config.ts` steuert datasource URL (nicht schema.prisma)
- ⚠ TailwindCSS v4: Nur `@theme { ... }` in globals.css – keine tailwind.config.ts
- ⚠ Port: 3002 (PM2 auf Server)
- Nach Schema-Änderung: `npm run db:push && npm run db:generate`
- Kein lokales Testing – direkt auf scpreview deployen
- Foto-Uploads landen in `public/uploads/properties/` und werden über `/api/uploads/[...path]` ausgeliefert (Next.js Production serviert keine dynamisch hinzugefügten Dateien aus public/)

## Crawling
- ✅ Produktion (vandelejk-immobilien.de): wird gecrawlt – `NEXT_PUBLIC_SITE_URL` enthält keine 'scpreview'
- ❌ Preview/Lokal: blockiert – URL enthält 'scpreview' oder 'localhost'
- Quelle: `src/app/robots.ts` (dynamisch). Keine statische `public/robots.txt` anlegen – die würde robots.ts überschreiben.

## Deploy
- Preview: `./deploy.sh preview`
- Live: `./deploy.sh live` (erst nach Freigabe durch Dennis!)
- DB + Uploads vom Server holen: `./pull-data.sh preview`

## Design-Vorgaben
- Farben: Weiß, Beige, Anthrazit #50535a
- Stil: Clean, leger, smart – KEIN generisches KI-Design
- Referenz: https://www.laura-liedtke-immobilien.de/
- Fonts: Playfair Display (Headings), Jost (Body/UI)
- Logo: Logo/SVG/VandeLejk-Logo-*.svg (schwarz/weiß/grau)

## Projektstand (2026-04-15)
- [x] Grundstruktur + Tech-Stack
- [x] Design & Frontend (alle öffentlichen Seiten)
- [x] Admin-Bereich vollständig (Login, Immobilien-CRUD, Kundenstimmen, Einstellungen)
- [x] SEO (Sitemap, robots.txt, JSON-LD, seitenspezifische Meta-Tags)
- [x] WCAG / Mobile-Responsiveness
- [ ] Echte Inhalte eintragen (Vanessa: Texte, Fotos, Google-Reviews API Key)
- [ ] Abnahme auf Preview durch Kundin
- [ ] Live-Deploy (erst nach Freigabe durch Dennis!)

## Als nächstes
1. Vanessa trägt Inhalte ein (Immobilien-Objekte, echte Fotos, Kundenstimmen)
2. Google-Reviews API Key in Admin → Einstellungen eintragen
3. Abnahme-Runde auf scpreview
4. Live-Deploy mit `./deploy.sh live`

## Admin-Zugang (Preview)
- URL: https://vandelejk-immobilien.scpreview.de/admin
- User: dennis / dennis@suchycreative.de
