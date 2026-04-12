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

## Wichtige Hinweise
- ⚠ Prisma 7: `prisma.config.ts` steuert datasource URL (nicht schema.prisma)
- ⚠ TailwindCSS v4: Nur `@theme { ... }` in globals.css – keine tailwind.config.ts
- ⚠ Port: 3002 (PM2 auf Server)
- Nach Schema-Änderung: `npm run db:push && npm run db:generate`

## Seiten
1. Home – Kurzbeschreibung, Leistungen anreißen, Kundenstimmen
2. Mein Angebot für Sie – Leistungsbeschreibung, alle Leistungen
3. Immobilienangebote – Beispiel-Objekt als Vorlage
4. Kontakt – Adresse, Tel, E-Mail, Über-mich Bild+Text, Kontaktformular
5. Impressum – /impressum
6. Datenschutz – /datenschutz

## Design-Vorgaben
- Farben: Weiß, Beige, Anthrazit #50535a
- Stil: Clean, leger, smart – KEIN generisches KI-Design
- Referenz: https://www.laura-liedtke-immobilien.de/
- Fonts: Playfair Display (Headings), Gill Sans Light (Subheadings)
- Logo: Logo/SVG/VandeLejk-Logo-*.svg (schwarz/weiß/grau)

## Deploy
- Preview: `./deploy.sh preview`
- Live: `./deploy.sh live` (erst nach Freigabe durch Dennis!)
- Kein lokales Testing – direkt auf scpreview deployen

## Initial-Admin
- User: dennis / dennis@suchycreative.de / password (bitte ändern!)

## Projektphase
<!-- Hier immer aktuell halten -->
- [x] Grundstruktur
- [ ] Design & Frontend
- [ ] Backend & Admin
- [ ] Content eintragen
- [ ] Preview testen
- [ ] Live-Deploy

## Zuletzt gemacht
- Projekt initialisiert (Next.js 16, Prisma 7, alle Deps)

## Als nächstes
- Design entwickeln (Referenz: laura-liedtke-immobilien.de)
- Frontend-Seiten umsetzen
