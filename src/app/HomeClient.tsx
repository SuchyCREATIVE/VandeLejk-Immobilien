"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, TrendingUp, Key, Star, ChevronDown, MapPin, Phone } from "lucide-react";

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
import { fadeUp, fadeIn } from "@/lib/animations";

const SERVICES = [
  {
    icon: Home,
    title: "Kauf & Verkauf",
    text: "Professionelle Begleitung beim Kauf und Verkauf von Wohn- und Gewerbeimmobilien – transparent, sicher und zuverlässig.",
  },
  {
    icon: TrendingUp,
    title: "Wertermittlung",
    text: "Fundierte Marktanalysen und realistische Werteinschätzungen für Ihre Immobilie – damit Sie den besten Preis erzielen.",
  },
  {
    icon: Key,
    title: "Vermietung",
    text: "Von der Mietersuche bis zur Schlüsselübergabe – ich begleite Sie durch den gesamten Vermietungsprozess.",
  },
];

interface Review {
  author: string;
  rating: number;
  text: string;
  time?: string;
}

interface ReviewsData {
  rating: number;
  totalRatings: number;
  reviews: Review[];
  source: "google" | "static";
}

interface DbTestimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

const DEFAULT_HERO = "/images/hero-building.jpg";

export default function HomeClient() {
  const [heroImage,    setHeroImage]    = useState(DEFAULT_HERO);
  const [reviewsData,  setReviewsData]  = useState<ReviewsData | null>(null);
  const [dbTestimonials, setDbTestimonials] = useState<DbTestimonial[]>([]);

  useEffect(() => {
    fetch("/api/settings/hero-image")
      .then((r) => r.json())
      .then((data) => { if (data.value) setHeroImage(data.value); })
      .catch(() => {});

    fetch("/api/google-reviews")
      .then((r) => r.json())
      .then((data) => setReviewsData(data))
      .catch(() => {});

    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => setDbTestimonials(data))
      .catch(() => {});
  }, []);

  // DB-Kundenstimmen haben Vorrang vor Google-Bewertungen
  const useDbTestimonials = dbTestimonials.length > 0;
  const reviews = useDbTestimonials
    ? dbTestimonials.map((t) => ({ author: t.name, rating: t.rating, text: t.text, time: t.role }))
    : (reviewsData?.reviews ?? []);
  const rating = reviewsData?.rating ?? 5.0;
  const totalRatings = reviewsData?.totalRatings ?? 15;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          HERO – 70 % Viewport-Höhe
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="VandeLejk Immobilien"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-anthrazit-dark/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/50" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.p
            variants={fadeUp(0)} initial="hidden" animate="visible"
            className="text-[10px] tracking-[0.45em] uppercase text-white/70 mb-8"
          >
            Immobilien · Hilden &amp; Umgebung
          </motion.p>
          <motion.h1
            variants={fadeUp(0.12)} initial="hidden" animate="visible"
            className="text-5xl md:text-6xl xl:text-7xl leading-[1.1] text-white mb-6 [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]"
          >
            Ihr Zuhause.<br />
            <em className="italic text-white/90">Meine Leidenschaft.</em>
          </motion.h1>
          <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.6, delay: 0.3 } } }}
            initial="hidden" animate="visible"
            className="w-14 h-px bg-white/50 mx-auto mb-8 origin-left"
          />
          <motion.p
            variants={fadeUp(0.35)} initial="hidden" animate="visible"
            className="text-[15px] leading-relaxed text-white/90 max-w-md mx-auto mb-12 [text-shadow:0_1px_12px_rgba(0,0,0,0.4)]"
          >
            Als Ihre persönliche Immobilienmaklerin begleite ich Sie mit Herzblut,
            Fachkenntnis und echtem Engagement – vom ersten Gespräch bis zum
            erfolgreichen Abschluss.
          </motion.p>
          <motion.div
            variants={fadeUp(0.45)} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/angebot"
              className="inline-flex items-center justify-center gap-2 bg-white text-anthrazit-dark px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:bg-cream transition-colors duration-300"
            >
              Mein Angebot <ArrowRight size={14} />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 border border-white/60 text-white px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Kontakt aufnehmen
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={fadeIn(0.8)} initial="hidden" animate="visible"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase">Entdecken</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-sand/20">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-sand/25">
          {[
            { value: `${totalRatings}`,           label: "Google-Bewertungen" },
            { value: `${rating.toFixed(1)}\u00a0★`, label: "Ø Bewertung" },
            { value: "Kostenlos",                  label: "Erstgespräch" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp(i * 0.08)} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="px-6 md:px-16 text-center first:pl-0 last:pr-0"
            >
              <p className="text-2xl md:text-3xl text-anthrazit-dark mb-1.5">{stat.value}</p>
              <p className="text-[9px] tracking-[0.25em] uppercase text-sand">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          LEITSPRUCH – Brand Statement
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white">
        <motion.div
          variants={fadeUp()} initial="hidden" whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-[11px] md:text-[13px] tracking-[0.55em] uppercase text-anthrazit-light mb-5">
            Verlässlich&nbsp;&nbsp;·&nbsp;&nbsp;Transparent&nbsp;&nbsp;·&nbsp;&nbsp;Nah
          </p>
          <h2 className="text-2xl md:text-4xl text-anthrazit-dark leading-snug">
            Mit Herz und Verstand<br />
            <em>auf dem Immobilienpfad.</em>
          </h2>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          LEISTUNGEN
      ══════════════════════════════════════════════════════════ */}
      <section className="py-36 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-4">
              Meine Leistungen für Sie
            </p>
            <h2 className="text-3xl md:text-4xl text-anthrazit-dark max-w-sm">
              Mein Leistungsangebot
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp(i * 0.1)} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                className="bg-white p-10 group hover:bg-beige transition-colors duration-300"
              >
                <div className="w-11 h-11 border border-sand flex items-center justify-center mb-6 group-hover:border-anthrazit transition-colors duration-300">
                  <s.icon size={18} className="text-anthrazit-light group-hover:text-anthrazit transition-colors" />
                </div>
                <h3 className="text-xl text-anthrazit-dark mb-3">{s.title}</h3>
                <p className="text-sm leading-relaxed text-anthrazit-light mb-6">
                  {s.text}
                </p>
                <Link
                  href="/angebot"
                  className="text-[10px] tracking-[0.2em] uppercase text-anthrazit inline-flex items-center gap-2 hover:gap-3 transition-all duration-200"
                >
                  Mehr erfahren <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ÜBER MICH – Großzügiges Editorial-Layout
      ══════════════════════════════════════════════════════════ */}
      <section className="overflow-hidden bg-white">
        <div className="grid lg:grid-cols-[55%_45%]">
          {/* Foto */}
          <motion.div
            variants={fadeIn(0)} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="relative min-h-[560px] lg:min-h-[700px]"
          >
            <Image
              src="/images/vanessa/vanessa-door.jpg"
                quality={90}
              alt="Vanessa Lejk – VandeLejk Immobilien"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            {/* Floating Label */}
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm px-5 py-3">
              <p className="text-[9px] tracking-[0.3em] uppercase text-sand mb-0.5">Vanessa Lejk</p>
              <p className="text-sm text-anthrazit-dark">Inhaberin · Immobilienmaklerin</p>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            variants={fadeUp(0.12)} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col justify-center px-10 md:px-14 xl:px-20 py-28 lg:py-40 bg-white"
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-6">
              Über mich
            </p>

            {/* Dekoratives Zitat */}
            <blockquote className="text-2xl md:text-3xl text-anthrazit-dark leading-snug mb-8 italic">
              „Persönlich.<br />Verlässlich.<br />Mit Herzblut."
            </blockquote>

            <div className="w-10 h-px bg-sand mb-8" />

            <p className="text-[15px] leading-relaxed text-anthrazit-light mb-5">
              Ich stehe für persönliche, ehrliche und lösungsorientierte Beratung.
              Bei mir sind Sie keine Nummer – ich nehme mir die Zeit für Ihre Wünsche
              und begleite Sie mit vollem Einsatz durch jeden Schritt Ihres
              Immobilienprojekts.
            </p>
            <p className="text-[15px] leading-relaxed text-anthrazit-light mb-10">
              Qualität vor Quantität: das ist mein Anspruch – und der Grund,
              warum meine Kunden mir vertrauen.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/angebot"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-anthrazit border-b border-sand pb-0.5 hover:border-anthrazit transition-colors duration-200"
              >
                Mein Angebot <ArrowRight size={12} />
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-anthrazit-light hover:text-anthrazit transition-colors duration-200"
              >
                Kontakt <ArrowRight size={12} />
              </Link>
            </div>

            {/* Kontakt-Snippet */}
            <div className="mt-14 pt-10 border-t border-sand/40 flex flex-col gap-3">
              <a
                href="https://maps.google.com/?q=Niedenstraße+113+40721+Hilden"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-anthrazit-light hover:text-anthrazit transition-colors"
              >
                <MapPin size={14} className="text-sand shrink-0" />
                Niedenstraße 113, 40721 Hilden
              </a>
              <a
                href="tel:+49"
                className="inline-flex items-center gap-2 text-sm text-anthrazit-light hover:text-anthrazit transition-colors"
              >
                <Phone size={14} className="text-sand shrink-0" />
                Auf Anfrage
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          IMMOBILIEN FEATURE – Hell, Bild eingefasst
      ══════════════════════════════════════════════════════════ */}
      <section className="py-36 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_56%] gap-16 items-center">

            {/* Text */}
            <motion.div
              variants={fadeUp(0)} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-5">
                Aktuelle Angebote
              </p>
              <h2 className="text-3xl md:text-4xl text-anthrazit-dark mb-6">
                Ausgewählte<br /><em>Immobilien</em>
              </h2>
              <div className="w-10 h-px bg-sand mb-8" />
              <p className="text-[15px] leading-relaxed text-anthrazit-light mb-10">
                Jedes Objekt wird von mir persönlich geprüft und mit größter
                Sorgfalt präsentiert. Von der Eigentumswohnung bis zum
                Einfamilienhaus.
              </p>
              <Link
                href="/immobilien"
                className="inline-flex items-center gap-2 border border-sand text-anthrazit px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:border-anthrazit transition-all duration-300"
              >
                Alle Angebote <ArrowRight size={13} />
              </Link>
            </motion.div>

            {/* Bild – eingefasst, nicht bis zum Rand */}
            <motion.div
              variants={fadeIn(0.1)} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="relative aspect-[4/3] overflow-hidden"
            >
              <Image
                src="/images/immobilien/interior-main.jpg"
                alt="Immobilien Innenansicht"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          GOOGLE BEWERTUNGEN
      ══════════════════════════════════════════════════════════ */}
      <section className="py-36 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6"
          >
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-4">
                Kundenstimmen
              </p>
              <h2 className="text-3xl md:text-4xl text-anthrazit-dark">
                Was Kunden sagen
              </h2>
            </div>

            {/* Rating Badge */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-4xl text-anthrazit-dark leading-none">{rating.toFixed(1)}</p>
                <div className="flex gap-0.5 justify-end mt-1.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={13} className="text-sand fill-sand" />
                  ))}
                </div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-anthrazit-light mt-1">
                  {totalRatings} Bewertungen auf Google
                </p>
              </div>
              {/* Google Icon */}
              <svg width="28" height="28" viewBox="0 0 48 48" className="shrink-0 opacity-60">
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
          </motion.div>

          {/* Review Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.slice(0, 3).map((review, i) => (
              <motion.div
                key={i}
                variants={fadeUp(i * 0.1)} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                className="bg-white p-7"
              >
                {/* Initialen-Avatar */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-beige flex items-center justify-center shrink-0">
                    <span className="text-[11px] tracking-wide text-anthrazit-dark uppercase">
                      {review.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-anthrazit-dark">{review.author}</p>
                    {review.time && (
                      <p className="text-[10px] text-anthrazit-light/60">{review.time}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={12} className="text-sand fill-sand" />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-anthrazit-light">
                  „{review.text}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* Link zu Google */}
          <motion.div
            variants={fadeUp(0.2)} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <a
              href="https://www.google.com/maps/search/VandeLejk+Immobilien+Hilden"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-anthrazit border-b border-sand pb-0.5 hover:border-anthrazit transition-colors duration-200"
            >
              Alle {totalRatings} Bewertungen auf Google <ArrowRight size={12} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA – Immobilien-BG · Vanessa schwebend · weiße Box
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Hintergrund: Immobilien-Foto */}
        <div className="absolute inset-0">
          <Image
            src="/images/immobilien/cta-background.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-anthrazit-dark/30" />
        </div>

        {/* Inhalt */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-end gap-0">

            {/* Vanessa – schwebendes Hochformat-Foto */}
            <motion.div
              variants={fadeIn(0)} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="hidden md:block relative w-52 lg:w-64 shrink-0 self-end"
              style={{ height: "360px" }}
            >
              <Image
                src="/images/vanessa/vanessa-cta.jpg"
                quality={90}
                alt="Vanessa Lejk"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 0px, 512px"
              />
            </motion.div>

            {/* Weiße Content-Box */}
            <motion.div
              variants={fadeUp(0.1)} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="bg-white px-10 py-12 md:py-14 max-w-md w-full"
            >
              <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-5">
                Ihr nächster Schritt
              </p>
              <h2 className="text-3xl text-anthrazit-dark mb-6">
                Bereit für Ihren<br />
                <em>nächsten Schritt?</em>
              </h2>
              <div className="w-8 h-px bg-sand mb-7" />
              <p className="text-sm leading-relaxed text-anthrazit-light mb-8">
                Ein unverbindliches Erstgespräch kostet Sie nichts – aber
                bringt Sie Ihrem Ziel einen großen Schritt näher.
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 bg-anthrazit-dark text-white px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:bg-anthrazit transition-all duration-300 mb-8"
              >
                Kontakt aufnehmen <ArrowRight size={13} />
              </Link>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-6 border-t border-beige">
                <a href="https://www.instagram.com/vandelejk_immobilien/" target="_blank" rel="noopener noreferrer"
                  className="text-sand hover:text-anthrazit transition-colors duration-200" aria-label="Instagram">
                  <IconInstagram size={16} />
                </a>
                <a href="https://www.facebook.com/vanessa.lejk" target="_blank" rel="noopener noreferrer"
                  className="text-sand hover:text-anthrazit transition-colors duration-200" aria-label="Facebook">
                  <IconFacebook size={16} />
                </a>
                <a href="https://www.linkedin.com/in/vanessa-lejk-b9a099221/" target="_blank" rel="noopener noreferrer"
                  className="text-sand hover:text-anthrazit transition-colors duration-200" aria-label="LinkedIn">
                  <IconLinkedin size={16} />
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
