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

## Projektstand (2026-05-03)
- [x] Grundstruktur + Tech-Stack
- [x] Design & Frontend
- [x] Admin-Bereich vollständig
- [x] SEO (dynamische robots.ts unter src/app/, sitemap, JSON-LD, Meta)
- [x] WCAG / Mobile-Responsiveness
- [x] Vanessa-Feedback Runde 1
- [x] Vanessa-Feedback Runde 2 (Bilder, Navbar-Sharpness, Über-mich-Layout, Admin-Routing)
- [x] Foto-Pipeline: sharp + WebP automatisch beim Upload (Resize 1920px, Quality 82)
- [x] Alle bestehenden Bilder rückwirkend auf WebP migriert (~14.7 MB gespart)
- [x] **Endabnahme durch Kundin – Vanessa ist zufrieden (2026-05-03)**
- [ ] Live-Deploy geplant für **2026-06-01** (Kundin meldet sich nochmal separat zur Bestätigung)
- [ ] Optional vor Live: vanessa-front.webp aus JPEG-max Original neu encodieren (siehe „Offene Punkte")
- [ ] Optional vor Live: Google-Reviews API Key in Admin → Einstellungen

## Zuletzt gemacht (2026-05-03) – Vanessa-Feedback Runde 2 + Endabnahme

**Bilder Erfolgsprojekt „Benrath" – kaputte Thumbs gefixt:**
- 5 von 9 Foto-URLs in der Server-DB zeigten auf `/api/uploads/properties/benrath-XX-rTIMESTAMP.webp` → 404, weil Vanessa die Fotos rotiert hatte und das Verzeichnis `public/uploads/` auf dem Server irgendwann (vor Einbau von `--exclude='public/uploads'` in deploy.sh) gewipt wurde.
- Fix: per `sqlite3` direkt auf Preview-DB die 5 kaputten Pfade auf die Originale unter `/images/immobilien/benrath/benrath-XX.webp` zurückgesetzt. Verzeichnis `public/uploads/properties/` auf dem Server vorsorglich neu angelegt.
- **Lehre:** Vanessas Rotationen sind unwiederbringlich verloren – sie kann bei Bedarf neu rotieren, jetzt sind die Files durch deploy.sh-Exclude geschützt.

**Admin-Routing-Bug in [src/app/(admin)/admin/erfolgsprojekte/page.tsx](src/app/(admin)/admin/erfolgsprojekte/page.tsx):** Stift-Icon routete noch auf alten Pfad `/admin/immobilien/${id}` → 404. Korrigiert auf `/admin/erfolgsprojekte/${id}`.

**Navbar-Schärfeproblem ([src/components/Navbar.tsx](src/components/Navbar.tsx)):** Beim Scrollen wurden Logo + Menüpunkte leicht unscharf, Ursache war `backdrop-blur-md` im scrolled-State (Compositing-Layer-Wechsel führt zu Sub-Pixel-Anti-Aliasing der SVG-/Text-Kanten). Lösung: Blur komplett raus, Hintergrund durchgängig `bg-white`, nur die Schatten-Intensität wechselt zwischen scrolled/non-scrolled. Visuell identisch, ohne Layer-Wechsel.

**Über-mich-Section auf der Startseite ([src/app/HomeClient.tsx](src/app/HomeClient.tsx) ca. Z.277-298):**
- Spaltenaufteilung von `55%/45%` auf `40%/60%` (Foto schmaler, Text mehr Raum) → Bild rendert kleiner = automatisch schärfer.
- Text-Container zusätzlich mit `max-w-xl` begrenzt, damit der Fließtext nicht in voller 60%-Breite ausläuft (zu „atemlos" gewirkt).
- Bild bleibt mit `object-top` verankert (Kopf muss sichtbar bleiben) – ein zwischenzeitlicher Versuch mit `object-center` hat den Kopf abgeschnitten.
- min-height der Foto-Spalte auf `lg:min-h-[760px]` erhöht.

**Offen: Bildqualität `vanessa-front.webp`:** Datei ist nur **1024×1536px** (vermutlich aus WhatsApp/iCloud kopiert). Die Originale liegen im Repo unter `Fotos/Fotoshooting 2026.02.02/JPEG-max/` als `Vanessa-Lajk-02022026-NNNNN.jpg` mit voller Auflösung. Vanessa muss noch sagen, welche Nummer dem aktuellen Frontportrait entspricht – dann aus dem Original neu encodieren (z.B. ~1600px breit, q88) für knackige Darstellung auf Desktop.

## Zuletzt davor (2026-04-29) – Vanessa-Feedback Runde 1

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

**Status: Kundin abgenommen – warten auf Live-Deploy-Freigabe.**

1. **Live-Deploy am 2026-06-01** – Vanessa meldet sich nochmal separat zur Bestätigung (vorher NICHT auf Live deployen!)
2. Vor Live-Deploy idealerweise erledigen:
   - `vanessa-front.webp` aus JPEG-max Original neu encodieren (Vanessa muss Nummer aus `Fotos/Fotoshooting 2026.02.02/JPEG-max/` nennen) – Datei ist aktuell nur 1024×1536px und wirkt auf Desktop matschig
   - Google-Reviews API Key in Admin → Einstellungen pflegen
   - Demo-Property „Eigentumswohnung 40215 Düsseldorf" aus DB löschen, falls Vanessa sie nicht braucht
3. Live-Deploy: `./deploy.sh live` (NICHT vorher!)
4. Nach Live-Deploy: SEO-Standard-Checks (siehe `feedback_seo_baseline.md` im globalen Memory) – Search Console Property + Sitemap, ggf. PageSpeed-Run.

## Admin-Zugang (Preview)
- URL: https://vandelejk-immobilien.scpreview.de/admin
- User: dennis / dennis@suchycreative.de
