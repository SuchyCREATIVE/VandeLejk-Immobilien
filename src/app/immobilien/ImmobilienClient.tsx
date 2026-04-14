"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Maximize2, BedDouble, Bath, Euro,
  ArrowRight, ChevronLeft, ChevronRight, X
} from "lucide-react";

import { fadeUp } from "@/lib/animations";

type Property = {
  id: string;
  address: string;
  city: string;
  type: string;
  status: string;
  price: string;
  area: string;
  rooms: number;
  bathrooms: number;
  floor: string;
  yearBuilt: string;
  description: string;
  highlights: string[];
  photos: string[];
};

function Gallery({ photos, address, city }: { photos: string[]; address: string; city: string }) {
  const [active,   setActive]   = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = (arr: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    return (arr - 1 + photos.length) % photos.length;
  };
  const next = (arr: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    return (arr + 1) % photos.length;
  };

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") { setLightbox(null); return; }
    if (lightbox !== null) {
      if (e.key === "ArrowLeft")  setLightbox((l) => l !== null ? (l - 1 + photos.length) % photos.length : l);
      if (e.key === "ArrowRight") setLightbox((l) => l !== null ? (l + 1) % photos.length : l);
    } else {
      if (e.key === "ArrowLeft")  setActive((a) => (a - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % photos.length);
    }
  }, [photos.length, lightbox]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <>
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
              alt={`${address} in ${city} – Foto ${active + 1}`}
              fill
              className="object-cover"
              quality={90}
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={(e) => { e.stopPropagation(); setActive(prev(active)); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Vorheriges Foto"
        >
          <ChevronLeft size={18} className="text-anthrazit" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setActive(next(active)); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Nächstes Foto"
        >
          <ChevronRight size={18} className="text-anthrazit" />
        </button>

        <div className="absolute bottom-3 right-3 bg-anthrazit-dark/70 text-white text-[10px] px-2.5 py-1 tracking-widest">
          {active + 1} / {photos.length}
        </div>
      </div>

      {photos.length > 1 && (
        <div className="grid grid-cols-6 gap-1.5 mt-1.5">
          {photos.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden ${
                i === active ? "ring-2 ring-anthrazit" : "opacity-60 hover:opacity-100"
              } transition-opacity`}
            >
              <Image src={src} alt={`${address} – Vorschaubild ${i + 1}`} fill className="object-cover" sizes="10vw" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-white/70 hover:text-white" aria-label="Schließen">
              <X size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(prev(lightbox)); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white/70 hover:text-white"
              aria-label="Vorheriges Foto"
            >
              <ChevronLeft size={36} />
            </button>
            <div
              className="relative max-w-4xl w-full max-h-[85vh] aspect-[16/10]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[lightbox]}
                alt={`${address} in ${city} – Foto ${lightbox + 1}`}
                fill
                className="object-contain"
                quality={90}
                sizes="90vw"
              />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(next(lightbox)); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white/70 hover:text-white"
              aria-label="Nächstes Foto"
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
  const [active,     setActive]     = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    fetch("/api/settings/immobilien")
      .then((r) => r.json())
      .then((d) => setActive(d.active ?? true))
      .catch(() => {});

    fetch("/api/properties")
      .then((r) => r.json())
      .then(setProperties)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!active) {
    return (
      <section className="pt-40 pb-32 px-6 bg-cream text-center">
        <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-5">Aktuelle Angebote</p>
        <h1 className="text-4xl md:text-5xl text-anthrazit-dark mb-6">Immobilienangebote</h1>
        <div className="w-12 h-px bg-sand mx-auto mb-10" />
        <p className="text-[15px] leading-relaxed text-anthrazit-light max-w-md mx-auto mb-10">
          Derzeit sind keine Objekte verfügbar. Sprechen Sie mich gerne direkt an –
          ich habe Zugang zu weiteren Angeboten.
        </p>
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 border border-sand text-anthrazit px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:border-anthrazit transition-colors duration-300"
        >
          Jetzt anfragen <ArrowRight size={12} />
        </Link>
      </section>
    );
  }

  if (!loading && properties.length === 0) {
    return (
      <section className="pt-40 pb-32 px-6 bg-cream text-center">
        <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-5">Aktuelle Angebote</p>
        <h1 className="text-4xl md:text-5xl text-anthrazit-dark mb-6">Immobilienangebote</h1>
        <div className="w-12 h-px bg-sand mx-auto mb-10" />
        <p className="text-[15px] leading-relaxed text-anthrazit-light max-w-md mx-auto mb-10">
          Derzeit sind keine Objekte verfügbar. Sprechen Sie mich gerne direkt an –
          ich habe Zugang zu weiteren Angeboten.
        </p>
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 border border-sand text-anthrazit px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:border-anthrazit transition-colors duration-300"
        >
          Jetzt anfragen <ArrowRight size={12} />
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* ─── Page Header ─── */}
      <section className="pt-36 pb-16 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <motion.p
            variants={fadeUp()} initial="hidden" animate="visible"
            className="text-[10px] tracking-[0.35em] uppercase text-sand mb-4"
          >
            Aktuelle Angebote
          </motion.p>
          <motion.h1
            variants={fadeUp(0.1)} initial="hidden" animate="visible"
            className="text-4xl md:text-5xl text-anthrazit-dark mb-5 max-w-lg"
          >
            Immobilienangebote
          </motion.h1>
          <motion.p
            variants={fadeUp(0.2)} initial="hidden" animate="visible"
            className="text-[15px] leading-relaxed text-anthrazit-light max-w-xl"
          >
            Ausgewählte Objekte – persönlich von mir geprüft und mit größter Sorgfalt präsentiert.
          </motion.p>
        </div>
      </section>

      {/* ─── Property List ─── */}
      {properties.map((p, idx) => (
        <section key={p.id} className={`py-16 px-6 ${idx % 2 === 1 ? "bg-cream" : ""}`}>
          <div className="max-w-5xl mx-auto">
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
                {p.photos.length > 0 && <Gallery photos={p.photos} address={p.address} city={p.city} />}

                <div className="mt-10">
                  <h2 className="text-2xl text-anthrazit-dark mb-2">{p.address}</h2>
                  <p className="flex items-center gap-1.5 text-sm text-anthrazit-light mb-8">
                    <MapPin size={14} /> {p.city}
                  </p>

                  {p.description && (
                    <>
                      <h3 className="text-lg text-anthrazit-dark mb-4">Objektbeschreibung</h3>
                      {p.description.split("\n\n").map((para, i) => (
                        <p key={i} className="text-sm leading-relaxed text-anthrazit-light mb-4">{para}</p>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>

              {/* Right: Stats + Contact */}
              <motion.div
                variants={fadeUp(0.15)} initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                className="space-y-5"
              >
                <div className="border border-beige p-6">
                  <h3 className="text-[10px] tracking-[0.25em] uppercase text-sand mb-5">Eckdaten</h3>
                  <ul className="space-y-3">
                    {[
                      { icon: Maximize2, label: "Wohnfläche",  val: p.area },
                      { icon: BedDouble, label: "Zimmer",       val: p.rooms },
                      { icon: Bath,      label: "Badezimmer",   val: p.bathrooms },
                      { icon: Euro,      label: "Kaufpreis",    val: p.price },
                    ].map((f) => f.val ? (
                      <li key={f.label} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-anthrazit-light">
                          <f.icon size={14} /> {f.label}
                        </span>
                        <span className="text-anthrazit font-[400]">{f.val}</span>
                      </li>
                    ) : null)}
                  </ul>
                </div>

                {p.highlights.length > 0 && (
                  <div className="border border-beige p-6">
                    <h3 className="text-[10px] tracking-[0.25em] uppercase text-sand mb-5">Highlights</h3>
                    <ul className="space-y-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-anthrazit-light">
                          <span className="w-1 h-1 rounded-full bg-sand mt-2 flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-anthrazit-dark text-white p-6">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4">Interesse geweckt?</p>
                  <p className="text-sm text-white/70 leading-relaxed mb-5">
                    Ich freue mich über Ihre Anfrage und melde mich schnellstmöglich bei Ihnen.
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
      ))}

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
