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

## Projektstand (2026-04-29)
- [x] Grundstruktur + Tech-Stack
- [x] Design & Frontend
- [x] Admin-Bereich vollständig
- [x] SEO (dynamische robots.ts unter src/app/, sitemap, JSON-LD, Meta)
- [x] WCAG / Mobile-Responsiveness
- [x] **Vanessa-Feedback Runde 1** (siehe „Zuletzt gemacht")
- [x] Foto-Pipeline: sharp + WebP automatisch beim Upload (Resize 1920px, Quality 82)
- [x] Alle bestehenden Bilder rückwirkend auf WebP migriert (~14.7 MB gespart)
- [ ] Vanessa pflegt echte Erfolgsprojekte ein
- [ ] Google-Reviews API Key in Admin → Einstellungen
- [ ] Endabnahme auf scpreview durch Kundin
- [ ] Live-Deploy (erst nach Freigabe durch Dennis!)

## Zuletzt gemacht (2026-04-29) – Vanessa-Feedback Runde 1

**Texte / Frontend:**
- Wort „kostenlos" überall raus (Premium-Positionierung) → „persönlich/exklusiv/fundiert"
- Italic nur noch im Hero-Claim „Meine Leidenschaft."; sonst überall raus
- Kauf-Liste: „Begleitung zum Notartermin" → „Erläuterung des notariellen Kaufvertrages"
- Verkauf-Liste: letzter Punkt → „Gesamte Abwicklung bis zur Schlüsselübergabe"
- Front-Portrait getauscht auf `public/images/vanessa/vanessa-front.webp` (Quelle: `Fotos/Fotoshooting 2026.02.02/Vanessa/Nr. 1 Bild _-).jpg`)

**Logo-Farbe konsistent:** alle 3 Anthrazit-Werte im @theme Block auf `#50535a` (Logo-Farbe). Vanessa-Wunsch: alles Richtung Logo, weniger Schwarz.

**Erfolgsprojekte-Umbau** (vorher: Immobilienangebote / `/immobilien`):
- Public-URL: `/erfolgsprojekte` (kein Redirect, `/immobilien` bleibt frei für später)
- Admin-URL: `/admin/erfolgsprojekte`
- Adresse wird **nicht** öffentlich angezeigt (intern weiter pflegbar)
- PLZ wird automatisch aus `city` entfernt (`displayCity()`-Helper, Regex `^\d{5}\s*`)
- Status-Badge prominent „Verkauft"
- Eigentümer-Zitat-Block (Felder `testimonialQuote` + `testimonialAuthor` im Property-Schema)
- CTA „Anfrage senden" → „Mein Angebot" (richtet sich an Verkäufer:innen)
- API-Pfade `/api/properties` + `/api/admin/properties` bleiben (interne Resourcen-Namen)

**Kontakt-Info:** Adresse von Startseite + Kontaktseite raus, stattdessen Tel `0157 752 995 23` und `kontakt@vandelejk-immobilien.de`. Footer behält die volle Adresse.

**Bot-Aufräumen:** `app/robots.ts` (vom Vorlagen-Bot an falscher Stelle abgelegt) → nach `src/app/robots.ts` verschoben, statische `public/robots.txt` entfernt. Crawling läuft jetzt dynamisch über env (siehe „Crawling"-Abschnitt).

**Foto-Pipeline (Wichtig!):**
- `sharp` ist jetzt direkte Dependency
- Upload-Route `src/app/api/admin/property-photos/route.ts` ruft sharp().rotate().resize(1920).webp(82)
- Migrations-Skript: `scripts/migrate-property-photos-to-webp.ts` (npm script: `migrate:photos-webp`) – läuft auf Server gegen die DB, konvertiert Files + updated DB-Pfade + bereinigt verwaiste Einträge
- Thumbs in [src/app/erfolgsprojekte/ImmobilienClient.tsx](src/app/erfolgsprojekte/ImmobilienClient.tsx) auf reines CSS-`background-image` umgestellt (next/image fill war fragil bei sehr kleinen sizes)

## Als nächstes

1. Vanessa öffnet Preview mit Hard-Reload (`Cmd+Shift+R`) und prüft die Runde 1
2. Falls Thumbs trotz Hard-Reload leer sind → Playwright-Debug in der Browser-Konsole
3. Vanessa kann jetzt echte Erfolgsprojekte einpflegen (Foto-Upload optimiert automatisch)
4. Demo-Property „Eigentumswohnung 40215 Düsseldorf" hatte verwaiste PNG-Verweise – wurden aus DB bereinigt; ggf. ganz löschen
5. Google-Reviews API Key
6. Endabnahme + Live-Deploy

## Admin-Zugang (Preview)
- URL: https://vandelejk-immobilien.scpreview.de/admin
- User: dennis / dennis@suchycreative.de
