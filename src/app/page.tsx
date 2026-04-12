"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, TrendingUp, Key, Star, Quote } from "lucide-react";
import { fadeUp, fadeIn, scaleLineX, VP } from "@/lib/animations";

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

const TESTIMONIALS = [
  {
    name: "Familie Schmidt",
    text: "Vanessa hat uns beim Kauf unserer ersten Wohnung hervorragend begleitet. Wir haben uns von Anfang an gut aufgehoben gefühlt. Sehr empfehlenswert!",
  },
  {
    name: "Thomas M.",
    text: "Professionell, ehrlich und immer erreichbar. Der Verkauf unseres Hauses lief reibungslos und zu einem super Preis. Vielen Dank, Vanessa!",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          HERO – Split: Text links · Portrait rechts
      ══════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col lg:flex-row pt-20">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-14 xl:px-24 py-20 bg-cream">
          <motion.p
            variants={fadeUp(0)} initial="hidden" animate="visible"
            className="text-[10px] tracking-[0.35em] uppercase text-sand mb-8"
          >
            Immobilien · Hilden &amp; Umgebung
          </motion.p>

          <motion.h1
            variants={fadeUp(0.1)} initial="hidden" animate="visible"
            className="text-4xl md:text-5xl xl:text-[3.5rem] leading-[1.2] text-anthrazit-dark mb-6"
          >
            Ihr Zuhause.<br />
            <em className="italic">Meine Leidenschaft.</em>
          </motion.h1>

          <motion.div
            variants={fadeUp(0)} initial="hidden" animate="visible"
            className="w-12 h-px bg-sand mb-6"
          />

          <motion.p
            variants={fadeUp(0.2)} initial="hidden" animate="visible"
            className="text-[15px] leading-relaxed text-anthrazit-light max-w-sm mb-10"
          >
            Als Ihre persönliche Immobilienmaklerin begleite ich Sie mit Herzblut,
            Fachkenntnis und echtem Engagement – vom ersten Gespräch bis zum
            erfolgreichen Abschluss.
          </motion.p>

          <motion.div
            variants={fadeUp(0.3)} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/angebot"
              className="inline-flex items-center justify-center gap-2 bg-anthrazit text-white px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:bg-anthrazit-dark transition-colors duration-300"
            >
              Mein Angebot <ArrowRight size={14} />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 border border-sand text-anthrazit px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:border-anthrazit transition-colors duration-300"
            >
              Kontakt aufnehmen
            </Link>
          </motion.div>
        </div>

        {/* Right: Portrait */}
        <motion.div
          variants={fadeIn(0.2)} initial="hidden" animate="visible"
          className="lg:w-[48%] xl:w-[45%] min-h-[55vh] lg:min-h-0 relative overflow-hidden"
        >
          <Image
            src="/images/vanessa/portrait.jpg"
            alt="Vanessa Lejk – VandeLejk Immobilien"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-anthrazit-dark/15 to-transparent" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          INTRO
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="text-[10px] tracking-[0.35em] uppercase text-sand mb-5"
          >
            Über VandeLejk Immobilien
          </motion.p>
          <motion.h2
            variants={fadeUp(0.1)} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="text-3xl md:text-4xl text-anthrazit-dark mb-6"
          >
            Mehr als nur ein Maklerbüro
          </motion.h2>
          <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.5 } } }}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="w-12 h-px bg-sand mx-auto mb-8 origin-left"
          />
          <motion.p
            variants={fadeUp(0.1)} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-[15px] leading-relaxed text-anthrazit-light"
          >
            Ich stehe für persönliche, ehrliche und lösungsorientierte Beratung.
            Bei mir sind Sie keine Nummer – ich nehme mir die Zeit für Ihre Wünsche
            und begleite Sie mit vollem Einsatz durch jeden Schritt Ihres
            Immobilienprojekts. Qualität vor Quantität: das ist mein Anspruch.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          LEISTUNGEN
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-5">
              Was ich für Sie tue
            </p>
            <h2 className="text-3xl md:text-4xl text-anthrazit-dark">
              Mein Leistungsangebot
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp(i * 0.12)} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                className="bg-white p-8 group hover:shadow-md transition-shadow duration-300"
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
          KUNDENSTIMMEN
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-5">
              Was Kunden sagen
            </p>
            <h2 className="text-3xl md:text-4xl text-anthrazit-dark">
              Kundenstimmen
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp(i * 0.12)} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                className="bg-beige p-8"
              >
                <Quote size={20} className="text-sand mb-4" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={13} className="text-sand fill-sand" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-anthrazit-light italic mb-6">
                  „{t.text}"
                </p>
                <p className="text-[10px] tracking-[0.25em] uppercase text-anthrazit">
                  {t.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-anthrazit-dark">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-[10px] tracking-[0.35em] uppercase text-white/40 mb-5"
          >
            Ihr nächster Schritt
          </motion.p>
          <motion.h2
            variants={fadeUp(0.1)} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl md:text-4xl text-white mb-8"
          >
            Bereit für Ihren<br />
            <em>nächsten Schritt?</em>
          </motion.h2>
          <motion.p
            variants={fadeUp(0.15)} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-sm leading-relaxed text-white/50 mb-10 max-w-sm mx-auto"
          >
            Ein unverbindliches Erstgespräch kostet Sie nichts – aber bringt Sie
            Ihrem Ziel einen großen Schritt näher.
          </motion.p>
          <motion.div
            variants={fadeUp(0.2)} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:border-white hover:bg-white/5 transition-all duration-300"
            >
              Jetzt Kontakt aufnehmen <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
