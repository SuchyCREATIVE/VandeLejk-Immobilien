"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Home, TrendingUp, Key, ClipboardCheck, MessageSquare,
  Camera, FileText, ArrowRight, CheckCircle2
} from "lucide-react";
import { fadeUp } from "@/lib/animations";

const SERVICES = [
  {
    icon: Home,
    title: "Kauf von Immobilien",
    img: "/images/immobilien/interior-main.jpg",
    description:
      "Sie suchen das passende Zuhause oder eine Kapitalanlage? Ich begleite Sie von der ersten Besichtigung bis zur notariellen Beurkundung – ehrlich, transparent und mit Ihren Interessen im Mittelpunkt.",
    details: [
      "Individuelle Bedarfsanalyse und Suchprofil",
      "Zugang zu exklusiven und marktfrischen Angeboten",
      "Begleitung bei Besichtigungen und Verhandlungen",
      "Unterstützung bei Finanzierungsplanung",
      "Begleitung zum Notartermin",
    ],
  },
  {
    icon: TrendingUp,
    title: "Verkauf von Immobilien",
    img: "/images/immobilien/cta-background.jpg",
    description:
      "Sie möchten Ihre Immobilie erfolgreich verkaufen? Mit einer fundierten Marktanalyse, professioneller Vermarktung und persönlichem Einsatz erzielen wir gemeinsam den bestmöglichen Preis.",
    details: [
      "Kostenlose Marktwertermittlung",
      "Professionelle Exposé-Erstellung",
      "Gezielte Online- und Offline-Vermarktung",
      "Sorgfältige Käuferprüfung",
      "Komplette Abwicklung bis zum Notartermin",
    ],
  },
  {
    icon: Key,
    title: "Vermietung",
    img: null,
    description:
      "Ob Erstanmietung oder Wiedervermietung – ich sorge dafür, dass Sie zuverlässige Mieter finden und der gesamte Prozess reibungslos verläuft.",
    details: [
      "Erstellung eines ansprechenden Inserats",
      "Koordination und Durchführung von Besichtigungen",
      "Bonitätsprüfung potenzieller Mieter",
      "Erstellung und Prüfung des Mietvertrags",
      "Wohnungsübergabe mit Protokoll",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Wertermittlung",
    img: null,
    description:
      "Sie wollen wissen, was Ihre Immobilie wert ist? Ich erstelle Ihnen eine fundierte und marktgerechte Werteinschätzung – ohne Verpflichtung.",
    details: [
      "Analyse von Lage, Zustand und Ausstattung",
      "Vergleich mit aktuellen Marktdaten",
      "Realistisches Preispotenzial",
      "Kostenfrei und unverbindlich",
    ],
  },
  {
    icon: MessageSquare,
    title: "Beratung & Begleitung",
    img: null,
    description:
      "Manchmal braucht man einfach einen kompetenten Ansprechpartner, der ehrlich antwortet. Ich berate Sie auch dann, wenn Sie (noch) keinen konkreten Auftrag haben.",
    details: [
      "Erstgespräch kostenlos und unverbindlich",
      "Einschätzung zu Kauf- und Verkaufsmöglichkeiten",
      "Unterstützung bei Verhandlungen",
      "Vermittlung von Notaren, Gutachtern, Handwerkern",
    ],
  },
  {
    icon: Camera,
    title: "Professionelle Fotografie",
    img: null,
    description:
      "Gute Fotos sind der erste Eindruck – und der zählt. Auf Wunsch koordiniere ich hochwertige Immobilienfotos, die Ihre Liegenschaft optimal in Szene setzen.",
    details: [
      "Professionelle Immobilienfotografie",
      "Bildbearbeitung und Webretusche",
      "Grundrisszeichnungen",
      "Optionales 360°-Virtual-Tour-Paket",
    ],
  },
];

export default function AngebotPage() {
  return (
    <>
      {/* ─── Cinematic Header ───────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/immobilien/cta-background.jpg"
            alt="VandeLejk Immobilien"
            fill
            className="object-cover object-center"
            quality={90}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-anthrazit-dark via-anthrazit-dark/50 to-anthrazit-dark/10" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 w-full">
          <motion.p
            variants={fadeUp(0)} initial="hidden" animate="visible"
            className="text-[10px] tracking-[0.45em] uppercase text-white/50 mb-4"
          >
            Meine Leistungen für Sie
          </motion.p>
          <motion.h1
            variants={fadeUp(0.1)} initial="hidden" animate="visible"
            className="text-5xl md:text-6xl text-white mb-6 max-w-xl leading-[1.1]"
          >
            Mein Angebot<br />
            <em className="italic text-white/80">für Sie</em>
          </motion.h1>
          <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.6, delay: 0.25 } } }}
            initial="hidden" animate="visible"
            className="w-12 h-px bg-white/30 mb-6 origin-left"
          />
          <motion.p
            variants={fadeUp(0.3)} initial="hidden" animate="visible"
            className="text-[15px] leading-relaxed text-white/70 max-w-lg"
          >
            Von der ersten Beratung bis zum erfolgreichen Abschluss – ich bin an
            Ihrer Seite. Persönlich, zuverlässig und mit echtem Engagement.
          </motion.p>
        </div>
      </section>

      {/* ─── Services Grid ──────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map((s, i) => (
              <motion.article
                key={s.title}
                variants={fadeUp(i * 0.06)} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                className="border border-beige hover:border-sand transition-colors duration-300 overflow-hidden group"
              >
                {/* Optionales Bild oben */}
                {s.img && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      quality={85}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-anthrazit-dark/20" />
                  </div>
                )}

                <div className="p-8">
                  <div className="w-11 h-11 border border-sand flex items-center justify-center mb-6">
                    <s.icon size={18} className="text-anthrazit-light" />
                  </div>
                  <h2 className="text-2xl text-anthrazit-dark mb-3">{s.title}</h2>
                  <p className="text-sm leading-relaxed text-anthrazit-light mb-6">
                    {s.description}
                  </p>
                  <ul className="space-y-2">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-anthrazit-light">
                        <CheckCircle2 size={14} className="text-sand mt-0.5 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Editoriales Mittelbild mit Vanessa ─────────────────── */}
      <section className="py-0">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-[1fr_1fr] overflow-hidden border border-beige"
          >
            {/* Bild */}
            <div className="relative min-h-[400px]">
              <Image
                src="/images/vanessa/vanessa-angebot.jpg"
                alt="Vanessa Lejk – Immobilienmaklerin"
                fill
                className="object-cover object-top"
                quality={90}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text */}
            <div className="bg-anthrazit-dark flex flex-col justify-center px-10 py-14">
              <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 mb-6">
                Mein Versprechen
              </p>
              <blockquote className="text-2xl md:text-3xl text-white leading-[1.35] mb-8">
                „Ich begleite Sie nicht<br />
                nur als Maklerin –<br />
                <em className="italic text-white/70">sondern als Vertraute."</em>
              </blockquote>
              <div className="w-10 h-px bg-white/20 mb-6" />
              <p className="text-sm text-white/60 leading-relaxed">
                Ehrlichkeit, Verlässlichkeit und persönliches Engagement –
                das sind die Werte, die meine Arbeit prägen. Jedes Objekt,
                jeder Kunde ist einzigartig.
              </p>
              <p className="mt-6 text-[11px] tracking-[0.15em] uppercase text-white/40">
                Vanessa Lejk · Immobilienmaklerin
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Wichtige Info ──────────────────────────────────────── */}
      <section className="py-16 px-6 bg-beige mt-24">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="flex gap-4 items-start"
          >
            <FileText size={20} className="text-sand flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg text-anthrazit-dark mb-2">Ihr Erstgespräch ist kostenlos</h3>
              <p className="text-sm leading-relaxed text-anthrazit-light">
                Lernen Sie mich unverbindlich kennen. Im Erstgespräch besprechen wir Ihre
                Situation, Ihre Wünsche und wie ich Ihnen am besten helfen kann – ohne
                Kosten, ohne Verpflichtung.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-anthrazit-dark">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            variants={fadeUp()} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl md:text-4xl text-white mb-8"
          >
            Klingt das nach dem,<br />
            <em>was Sie suchen?</em>
          </motion.h2>
          <motion.div
            variants={fadeUp(0.1)} initial="hidden" whileInView="visible"
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
