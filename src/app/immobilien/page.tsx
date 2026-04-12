"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Maximize2, BedDouble, Bath, Euro,
  ArrowRight, ChevronLeft, ChevronRight, X
} from "lucide-react";

import { fadeUp, scaleLineX, VP } from "@/lib/animations";

/* ─── Beispiel-Objekt ──────────────────────────────────────── */
const PROPERTY = {
  id:          "roepke-51",
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
  description: `Diese gepflegte Eigentumswohnung befindet sich in einer ruhigen Seitenstraße im Herzen von Düsseldorf-Oberbilk. Die helle, gut geschnittene Wohnung überzeugt durch ihre moderne Ausstattung und den praktischen Grundriss.

Das Wohnzimmer ist geräumig und lichtdurchflutet, die Küche vollständig eingebaut und funktional. Beide Schlafzimmer bieten ausreichend Platz, das Badezimmer ist hochwertig gefliest und mit ebenerdiger Dusche ausgestattet.

Ein Kellerabteil und ein Stellplatz im Innenhof runden das Angebot ab. Die Lage in unmittelbarer Nähe zu öffentlichen Verkehrsmitteln, Einkaufsmöglichkeiten und Schulen macht diese Wohnung besonders attraktiv.`,
  highlights: [
    "Vollständig modernisiert",
    "Einbauküche inklusive",
    "Ebenerdige Dusche",
    "Kellerabteil",
    "Tiefgaragenstellplatz",
    "ÖPNV in 3 Minuten",
  ],
  photos: [
    "/images/immobilien/roepke-01.jpg",
    "/images/immobilien/roepke-02.jpg",
    "/images/immobilien/roepke-03.jpg",
    "/images/immobilien/roepke-04.jpg",
    "/images/immobilien/roepke-05.jpg",
    "/images/immobilien/roepke-06.jpg",
  ],
};

function Gallery({ photos }: { photos: string[] }) {
  const [active,  setActive]  = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = (arr: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    return (arr - 1 + photos.length) % photos.length;
  };
  const next = (arr: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    return (arr + 1) % photos.length;
  };

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-[16/10] overflow-hidden cursor-zoom-in bg-beige"
        onClick={() => setLightbox(active)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={photos[active]}
              alt={`Foto ${active + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrow overlays */}
        <button
          onClick={(e) => { e.stopPropagation(); setActive(prev(active)); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
        >
          <ChevronLeft size={18} className="text-anthrazit" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setActive(next(active)); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
        >
          <ChevronRight size={18} className="text-anthrazit" />
        </button>

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-anthrazit-dark/70 text-white text-[10px] px-2.5 py-1 tracking-widest">
          {active + 1} / {photos.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-6 gap-1.5 mt-1.5">
        {photos.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative aspect-square overflow-hidden ${
              i === active ? "ring-2 ring-anthrazit" : "opacity-60 hover:opacity-100"
            } transition-opacity`}
          >
            <Image src={src} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="10vw" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(prev(lightbox)); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            >
              <ChevronLeft size={36} />
            </button>
            <div
              className="relative max-w-4xl w-full max-h-[85vh] aspect-[16/10]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[lightbox]}
                alt={`Foto ${lightbox + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(next(lightbox)); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            >
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ImmobilienPage() {
  const p = PROPERTY;

  return (
    <>
      {/* ─── Page Header ─── */}
      <section className="pt-40 pb-20 px-6 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            variants={fadeUp()} initial="hidden" animate="visible"
            className="text-[10px] tracking-[0.35em] uppercase text-sand mb-5"
          >
            Aktuelle Angebote
          </motion.p>
          <motion.h1
            variants={fadeUp(0.1)} initial="hidden" animate="visible"
            className="text-4xl md:text-5xl text-anthrazit-dark mb-6"
          >
            Immobilienangebote
          </motion.h1>
          <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.5 } } }}
            initial="hidden" animate="visible"
            className="w-12 h-px bg-sand mx-auto mb-8 origin-left"
          />
          <motion.p
            variants={fadeUp(0.2)} initial="hidden" animate="visible"
            className="text-[15px] leading-relaxed text-anthrazit-light max-w-xl mx-auto"
          >
            Hier finden Sie ausgewählte Immobilienangebote. Jedes Objekt wird von
            mir persönlich geprüft und mit größter Sorgfalt präsentiert.
          </motion.p>
        </div>
      </section>

      {/* ─── Property Detail ─── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Badge */}
          <motion.div
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="inline-block border border-sand text-[10px] tracking-[0.2em] uppercase text-anthrazit-light px-3 py-1">
              {p.type} · {p.status}
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_340px] gap-12">
            {/* Left: Gallery + Description */}
            <motion.div
              variants={fadeUp(0.05)} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
            >
              <Gallery photos={p.photos} />

              <div className="mt-10">
                <h2 className="text-2xl text-anthrazit-dark mb-2">{p.address}</h2>
                <p className="flex items-center gap-1.5 text-sm text-anthrazit-light mb-8">
                  <MapPin size={14} /> {p.city}
                </p>

                <h3 className="text-lg text-anthrazit-dark mb-4">Objektbeschreibung</h3>
                {p.description.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-anthrazit-light mb-4">
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Right: Stats + Contact Box */}
            <motion.div
              variants={fadeUp(0.15)} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5"
            >
              {/* Key Facts */}
              <div className="border border-beige p-6">
                <h3 className="text-[10px] tracking-[0.25em] uppercase text-sand mb-5">
                  Eckdaten
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: Maximize2, label: "Wohnfläche",   val: p.area },
                    { icon: BedDouble, label: "Zimmer",        val: p.rooms },
                    { icon: Bath,      label: "Badezimmer",    val: p.bathrooms },
                    { icon: Euro,      label: "Kaufpreis",     val: p.price },
                  ].map((f) => (
                    <li key={f.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-anthrazit-light">
                        <f.icon size={14} />
                        {f.label}
                      </span>
                      <span className="text-anthrazit font-[400]">{f.val}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Highlights */}
              <div className="border border-beige p-6">
                <h3 className="text-[10px] tracking-[0.25em] uppercase text-sand mb-5">
                  Highlights
                </h3>
                <ul className="space-y-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-anthrazit-light">
                      <span className="w-1 h-1 rounded-full bg-sand mt-2 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Box */}
              <div className="bg-anthrazit-dark text-white p-6">
                <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4">
                  Interesse geweckt?
                </p>
                <p className="text-sm text-white/70 leading-relaxed mb-5">
                  Ich freue mich über Ihre Anfrage und melde mich schnellstmöglich
                  bei Ihnen.
                </p>
                <Link
                  href="/kontakt"
                  className="flex items-center justify-center gap-2 border border-white/20 text-white py-3 text-[11px] tracking-[0.2em] uppercase hover:border-white/50 transition-colors duration-300"
                >
                  Anfrage senden <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Info Banner ─── */}
      <section className="py-14 px-6 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-sm leading-relaxed text-anthrazit-light"
          >
            Suchen Sie ein bestimmtes Objekt, das hier noch nicht aufgeführt ist?
            Sprechen Sie mich an – ich habe Zugang zu weiteren Angeboten und helfe
            Ihnen, die passende Immobilie zu finden.
          </motion.p>
          <motion.div
            variants={fadeUp(0.1)} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="mt-6"
          >
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-anthrazit border-b border-sand pb-0.5 hover:border-anthrazit transition-colors duration-200"
            >
              Jetzt anfragen <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
