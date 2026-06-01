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

## Projektstand (2026-05-31)
- [x] Grundstruktur + Tech-Stack
- [x] Design & Frontend
- [x] Admin-Bereich vollständig
- [x] SEO (dynamische robots.ts unter src/app/, sitemap, JSON-LD, Meta)
- [x] WCAG / Mobile-Responsiveness
- [x] Vanessa-Feedback Runde 1
- [x] Vanessa-Feedback Runde 2 (Bilder, Navbar-Sharpness, Über-mich-Layout, Admin-Routing)
- [x] Vanessa-Feedback Runde 3 (Hero-Höhe, Stats, CTA-Foto, Footer, Kontakt-Portrait, info@, Objekt-Status)
- [x] Foto-Pipeline: sharp + WebP automatisch beim Upload (Resize 1920px, Quality 82)
- [x] Alle bestehenden Bilder rückwirkend auf WebP migriert (~14.7 MB gespart)
- [x] **Endabnahme durch Kundin – Vanessa ist zufrieden (2026-05-03)**
- [ ] **NEUER Live-Termin: Freitag 2026-06-05 ca. 18 Uhr** – Vanessa gibt vorher nochmal ein „Startsignal" (vorher NICHT live!)
- [ ] **Offen: Impressum + Datenschutz** – Dennis liefert finale e-recht24-Texte separat (DE), dann Platzhalter ersetzen
- [ ] Optional vor Live: Google-Reviews API Key in Admin → Einstellungen

## Zuletzt gemacht (2026-05-31) – Vanessa-Feedback Runde 3 (final vor Go-Live)

Quelle: E-Mail „Der Countdown läuft :-)" vom 20.05. (`Screenshots/Der Countdown läuft --).eml`), 9 markierte Screenshots. Neuer Live-Termin **05.06. ~18 Uhr**. Alles auf Preview deployt.

1. **Hero-Höhe** ([HomeClient.tsx:113](src/app/HomeClient.tsx#L113)): `min-h-[70vh] justify-center` ohne Top-Padding → auf kürzeren Viewports kollidierte der zentrierte Inhalt oben mit der fixierten Navbar und unten mit dem absoluten „Entdecken"-Indikator (Eyebrow + Buttons verschwanden). Fix: `min-h-[80vh] pt-28 pb-24`, Scroll-Indikator `[@media(max-height:720px)]:hidden`.
2. **Stats-Strip**: „Persönlich" → „Persönliches" (rendert „Persönliches Erstgespräch"). [HomeClient.tsx:195](src/app/HomeClient.tsx#L195).
3. **CTA-Sektion „Bereit für nächsten Schritt"**: schiefes Vanessa-Foto (`vanessa-cta.webp`) entfernt, weiße Box jetzt zentriert (`flex justify-center` statt `items-end justify-end`).
4. **Footer** ([Footer.tsx](src/components/Footer.tsx)): Adress-Block raus, stattdessen klickbare Tel `0157 752 995 23` + Mail `info@`. Adresse bleibt fürs SEO im JSON-LD (`layout.tsx`) + Impressum → Vanessas SEO-Frage damit beantwortet (Footer-Adresse nicht ranking-entscheidend). LinkedIn unverändert (funktioniert bei Dennis).
5. **Kontakt-Seite** ([KontaktClient.tsx:90](src/app/kontakt/KontaktClient.tsx#L90)): rechteckiges `aspect-[3/4]`-Foto (`vanessa-door.webp`) → rundes Portrait `w-56 h-56 rounded-full` mit `vanessa-front.webp` (Startseiten-„Über mich"-Bild, wie von Vanessa gewünscht).
6. **E-Mail vereinheitlicht** auf `info@vandelejk-immobilien.de` (war Build-Default `kontakt@`): JSON-LD ([layout.tsx:53](src/app/layout.tsx#L53)), Hero-Snippet ([HomeClient.tsx](src/app/HomeClient.tsx)), Kontaktseite. `kontakt@` kam nie von Vanessa – Default vom 29.04.
7. **Objekt-Status** (Server-DB direkt per `sqlite3`, da `db:seed` existierende Rows überspringt + `*.db` vom deploy-rsync ausgeschlossen ist):
   - „Eigentumswohnung Düsseldorf" (Röpkestraße 51): `Vorlage-Objekt` → `Verkauft`, city → `40233 Düsseldorf Flingern` (displayCity zeigt „Düsseldorf Flingern"), Beschreibung „Oberbilk" → „Flingern".
   - „Einfamilienhaus Benrath" (Im Diepental 18): `Zu verkaufen` → `Verkauft`.
   - `prisma/seed.ts` ebenfalls angepasst (für künftige Frisch-Seeds konsistent).

**Zurückgestellt (Punkte 8+9 der Mail):** Impressum + Datenschutz – Dennis liefert finale **e-recht24-Texte separat**, dann Platzhalter ersetzen (analog Rumler). Vanessa hat Impressum-Daten bereits in der Mail mitgeliefert (Kreisverwaltung Mettmann als Aufsichtsbehörde, §34c via Kreis Mettmann/Der Landrat, IHK Düsseldorf, VSBG-Hinweis).

**Bild-Performance (gleiche Session, Dennis-Report „Hero lädt langsam"):** Hero wurde mit 336 KB WebP ausgeliefert, Next lieferte **kein AVIF** (nicht konfiguriert). Fix:
- `next.config.ts`: `images.formats = ["image/avif","image/webp"]` + `qualities: [65,75,85,90,95]` (Next 16 erfordert quality-Allowlist). → ganze Seite liefert jetzt AVIF, global ~30-50 % kleiner.
- Hero-`<Image>` auf `quality={65}` (liegt hinter 55 % Dunkel-Overlay → kein sichtbarer Verlust) + beschreibender Alt-Text mit „Hilden".
- **Hero-Upload-Route** ([api/admin/hero-image/route.ts](src/app/api/admin/hero-image/route.ts)) speicherte Originale unoptimiert unter `/uploads/` (404-Gefahr in Prod). Jetzt `sharp().rotate().resize(2400).webp(80)` wie die Property-Fotos + Auslieferung über `/api/uploads/...`. → Auto-WebP bei jedem Upload, in ALLEN Upload-Routen.
- **Ergebnis gemessen:** Hero 336 KB → **195 KB AVIF** (~42 % leichter), WebP-Fallback 304 KB.

**PDF-Broschüren (BOTTIMMO, von Vanessa beigelegt):** Einsteiger-Marketing-Material. Wir sind technisch bereits darüber (JSON-LD, WebP/AVIF, UX, Person-forward, lokal). Echte Rest-Wins laut Heften = On-Page-SEO-Feintuning: keyword-stärkere Title/Meta + beschreibende Alt-Texte → daraus wurde der SEO-Sprint (unten).

## Zuletzt gemacht (2026-06-01) – Bild-Ladezeit-Fix + SEO-Sprint (audit-website)

**Bild-Ladezeit (Dennis: „dauert 2-3 s"):** Ursache war AVIF-Encoding auf dem schwachen Shared-Host – **erster** Aufruf eines Bildes ~3,2 s (gemessen), warm 0,12 s. Der next/image-Cache wird bei jedem Deploy neu aufgebaut → erster Besucher zahlt. Fix:
- `deploy.sh`: **Bild-Cache-Vorwärmung** nach Deploy – holt alle `/_next/image`-URLs der Hauptseiten (`/`, `/kontakt`, `/angebot`, `/erfolgsprojekte`) und encodiert sie mit AVIF+WebP vorab. Kein Besucher wartet mehr. Gemessen danach: Hero 0,16 s.
- `next.config.ts`: `deviceSizes`/`imageSizes` verschlankt (weniger CPU-Encodes), `minimumCacheTTL: 31536000`, `qualities: [65,75,80,85]`. Bildqualitäten im Code von q90/q95 auf q80 gesenkt (hero q65) → kleinere Bytes.
- **AVIF ist Google-konform** (Chrome/Googlebot unterstützen es, WebP-Fallback automatisch) – Dennis hatte gefragt.

**SEO-Sprint mit `audit-website`-Skill (squirrel CLI):** Audit gegen Preview (robots via `squirrel config set crawler.respect_robots false`, da Preview Crawler blockt). **Score 62→67 (D)**, harte Fehler 6→2 (Rest = Preview-only: robots-Block + Sitemap zeigt auf Live-Domain → lösen sich beim Go-Live, Crawlability springt dann 65→~95). Umgesetzt:
- **Technik:** Kontaktformular-a11y (label `htmlFor`/`id` + Honeypot mit Accessible Name → Accessibility 92→97), Title-Doppel-Branding entfernt (Layout-Template hängt `· VandeLejk Immobilien` an – Seitentitel hatten zusätzlich „| VandeLejk"), CTA-Alt-Text.
- **Content (Scope mit Dennis abgestimmt, Städte Hilden+Düsseldorf+Umland):** Region-Block Startseite, „So läuft Ihr Verkauf ab" (4 Schritte) + **FAQ mit `FAQPage`-JSON-LD** auf /angebot (FAQ-Quelle: `src/lib/faq.ts`, geteilt mit Schema), Erfolgsprojekte-Intro erweitert. Keyword-optimierte Titles/Meta auf allen 4 Seiten. **Kein Provisionssatz** in FAQ (Dennis-Vorgabe).
- **Rückgängig machbar:** Rollback-Tag `pre-seo-content-2026-06-01` (Commit fe4c0a3) vor dem Content-Ausbau. Falls Vanessa die SEO-Texte nicht mag: `git reset --hard pre-seo-content-2026-06-01` + redeploy.

**Offen:** LinkedIn-URL 404t für Crawler/ausgeloggte Besucher (für Dennis eingeloggt ok) – Vanessa soll öffentliche Profil-URL prüfen, sonst Icon raus. /kontakt + Startseite (295 Wörter, knapp unter 300) optional noch leicht ausbaubar.

**Turnstile (Spam-Schutz) + Google-Fonts-Check (2026-06-01, gleiche Session):**
- **Google Fonts sind bereits lokal** – `next/font/google` (Playfair, Jost) self-hosted unter `/_next/static/media/*.woff2`, KEINE externen googleapis/gstatic-Requests. DSGVO-konform, nichts zu tun.
- **Cloudflare Turnstile** komplett eingebaut, im Admin schaltbar (3 Settings-Keys: `turnstile_enabled` Toggle, `turnstile_site_key`, `turnstile_secret_key`). Key-Value-Settings → keine Schema-Migration.
  - Admin-Sektion „Spam-Schutz" in `(admin)/admin/einstellungen/page.tsx` (Toggle + 2 Keys, Link zum Cloudflare-Dashboard).
  - Öffentlicher Endpunkt `GET /api/settings/turnstile` liefert NUR `{enabled, siteKey}` (Secret bleibt serverseitig).
  - Frontend [KontaktClient.tsx](src/app/kontakt/KontaktClient.tsx): lädt Widget via `next/script` nur wenn aktiviert, Token wird mitgesendet, Submit blockt ohne Token, Reset bei Fehler.
  - Serverseitige Verifikation in [api/contact/route.ts](src/app/api/contact/route.ts) (`verifyTurnstile` → Cloudflare siteverify). **Default deaktiviert** → Formular verhält sich ohne Keys wie bisher (Honeypot + Rate-Limit).
- **Beobachtung:** Test-POST aufs Kontaktformular gibt auf Preview HTTP 500 an der SMTP-Stelle (Mailversand) – vermutlich SMTP-Passwort auf Preview nicht gesetzt. Vorbestehend, vor Go-Live Live-Versand testen.

## Zuletzt davor (2026-05-03) – Vanessa-Feedback Runde 2 + Endabnahme

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

**Status: Runde-3-Korrekturen auf Preview live – warten auf finale Rechtstexte + Vanessas Startsignal.**

1. **Impressum + Datenschutz einbauen**, sobald Dennis die finalen e-recht24-Texte liefert:
   - [src/app/impressum/page.tsx](src/app/impressum/page.tsx) – Platzhalter [Telefonnummer], [E-Mail-Adresse], Aufsichtsbehörde, §34c-Aktenzeichen
   - [src/app/datenschutz/page.tsx](src/app/datenschutz/page.tsx) – [Monat Jahr], [E-Mail-Adresse], Platzhalter-Warnbox am Ende entfernen
2. **Live-Deploy: Freitag 2026-06-05 ca. 18 Uhr** – Vanessa gibt vorher nochmal ein „Startsignal" (vorher NICHT auf Live deployen!). `./deploy.sh live`
3. Optional vor Live: Google-Reviews API Key in Admin → Einstellungen pflegen.
4. Nach Live-Deploy: SEO-Standard-Checks (siehe `feedback_seo_baseline.md` im globalen Memory) – Search Console Property + Sitemap, ggf. PageSpeed-Run.

**Vanessa-Rückmeldung an sie (offene Antworten):** LinkedIn funktioniert (war wohl temporär), Footer-Adresse nicht SEO-entscheidend (steckt im JSON-LD), `kontakt@`→`info@` korrigiert.

## Admin-Zugang (Preview)
- URL: https://vandelejk-immobilien.scpreview.de/admin
- User: dennis / dennis@suchycreative.de
