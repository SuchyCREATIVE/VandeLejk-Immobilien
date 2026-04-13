// Legt Initial-Admin, Beispiel-Objekt und Kundenstimmen an
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const dbPath = dbUrl.replace(/^file:/, "");
const resolvedPath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
const adapter = new PrismaBetterSqlite3({ url: resolvedPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ─── Admin-User ───────────────────────────────────────────
  const hash = await bcrypt.hash("password", 12);
  await prisma.user.upsert({
    where:  { email: "dennis@suchycreative.de" },
    update: {},
    create: {
      username:     "dennis",
      email:        "dennis@suchycreative.de",
      passwordHash: hash,
      role:         "admin",
    },
  });
  console.log("✓ Admin dennis@suchycreative.de angelegt");

  // ─── Redakteur Vanessa ─────────────────────────────────────
  const vanessa = await prisma.user.findUnique({ where: { email: "vanessa@vandelejk-immobilien.de" } });
  if (!vanessa) {
    const vanessaHash = await bcrypt.hash("vandelejk2026", 12);
    await prisma.user.create({
      data: {
        username:     "vanessa",
        email:        "vanessa@vandelejk-immobilien.de",
        passwordHash: vanessaHash,
        role:         "redakteur",
      },
    });
    console.log("✓ Redakteur vanessa@vandelejk-immobilien.de angelegt");
  } else {
    console.log("– Vanessa existiert bereits");
  }

  // ─── SMTP-Einstellungen ───────────────────────────────────
  const defaults = [
    { key: "smtp_host",      value: "mail.scpreview.de" },
    { key: "smtp_port",      value: "587" },
    { key: "smtp_user",      value: "website@scpreview.de" },
    { key: "smtp_pass",      value: "" },
    { key: "smtp_from",      value: "noreply@vandelejk-immobilien.de" },
    { key: "smtp_from_name", value: "VandeLejk Immobilien" },
  ];
  for (const s of defaults) {
    await prisma.settings.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log("✓ SMTP-Startdaten gesetzt");

  // ─── Beispiel-Objekt ──────────────────────────────────────
  const roepkePhotos = JSON.stringify([
    "/images/immobilien/roepke-01.jpg",
    "/images/immobilien/roepke-02.jpg",
    "/images/immobilien/roepke-03.jpg",
    "/images/immobilien/roepke-04.jpg",
    "/images/immobilien/roepke-05.jpg",
    "/images/immobilien/roepke-06.jpg",
  ]);
  const roepkeData = {
    address:     "Röpkestraße 51",
    city:        "40215 Düsseldorf",
    type:        "Eigentumswohnung",
    status:      "Vorlage-Objekt",
    price:       "auf Anfrage",
    area:        "82 m²",
    rooms:       3,
    bathrooms:   1,
    floor:       "2. Obergeschoss",
    yearBuilt:   "1975 (Kernsaniert 2019)",
    description: "Diese gepflegte Eigentumswohnung befindet sich in einer ruhigen Seitenstraße im Herzen von Düsseldorf-Oberbilk. Die helle, gut geschnittene Wohnung überzeugt durch ihre moderne Ausstattung und den praktischen Grundriss.\n\nDas Wohnzimmer ist geräumig und lichtdurchflutet, die Küche vollständig eingebaut und funktional. Beide Schlafzimmer bieten ausreichend Platz, das Badezimmer ist hochwertig gefliest und mit ebenerdiger Dusche ausgestattet.\n\nEin Kellerabteil und ein Stellplatz im Innenhof runden das Angebot ab. Die Lage in unmittelbarer Nähe zu öffentlichen Verkehrsmitteln, Einkaufsmöglichkeiten und Schulen macht diese Wohnung besonders attraktiv.",
    highlights:  JSON.stringify([
      "Vollständig modernisiert",
      "Einbauküche inklusive",
      "Ebenerdige Dusche",
      "Kellerabteil",
      "Tiefgaragenstellplatz",
      "ÖPNV in 3 Minuten",
    ]),
    photos:    roepkePhotos,
    active:    true,
    sortOrder: 0,
  };
  const existingProp = await prisma.property.findFirst({ where: { address: "Röpkestraße 51" } });
  if (existingProp) {
    await prisma.property.update({ where: { id: existingProp.id }, data: { photos: roepkePhotos } });
    console.log("✓ Fotos Röpkestraße 51 aktualisiert");
  } else {
    await prisma.property.create({ data: roepkeData });
    console.log("✓ Beispiel-Objekt Röpkestraße 51 angelegt");
  }

  // ─── Beispiel-Kundenstimmen ───────────────────────────────
  const testCount = await prisma.testimonial.count();
  if (testCount === 0) {
    const testimonials = [
      {
        name: "Familie Müller", role: "Käufer aus Hilden",
        text: "Vanessa hat uns beim Kauf unseres Eigenheims hervorragend begleitet. Kompetent, ehrlich und immer erreichbar – wir hätten uns keine bessere Begleitung wünschen können.",
        rating: 5, sortOrder: 0,
      },
      {
        name: "Sabine K.", role: "Verkäuferin aus Düsseldorf",
        text: "Der Verkauf meiner Wohnung lief reibungslos und schneller als erwartet. Vanessa hat den richtigen Preis angesetzt und die perfekten Käufer gefunden.",
        rating: 5, sortOrder: 1,
      },
      {
        name: "Thomas B.", role: "Mieter aus Langenfeld",
        text: "Professionell, sympathisch und wirklich hilfsbereit. Ich fühlte mich während des gesamten Prozesses bestens aufgehoben.",
        rating: 5, sortOrder: 2,
      },
    ];
    for (const t of testimonials) {
      await prisma.testimonial.create({ data: { ...t, active: true } });
    }
    console.log("✓ 3 Beispiel-Kundenstimmen angelegt");
  } else {
    console.log("– Kundenstimmen existieren bereits, übersprungen");
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
