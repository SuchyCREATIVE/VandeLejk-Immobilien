"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Home, TrendingUp, Key, ClipboardCheck, MessageSquare,
  Camera, FileText, ArrowRight, CheckCircle2
} from "lucide-react";
import { fadeUp, scaleLineX, VP } from "@/lib/animations";

const SERVICES = [
  {
    icon: Home,
    title: "Kauf von Immobilien",
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
      {/* ─── Page Header ─── */}
      <section className="pt-40 pb-20 px-6 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            variants={fadeUp()} initial="hidden" animate="visible"
            className="text-[10px] tracking-[0.35em] uppercase text-sand mb-5"
          >
            Was ich für Sie tue
          </motion.p>
          <motion.h1
            variants={fadeUp(0.1)} initial="hidden" animate="visible"
            className="text-4xl md:text-5xl text-anthrazit-dark mb-6"
          >
            Mein Angebot für Sie
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
            Von der ersten Beratung bis zum erfolgreichen Abschluss – ich bin an
            Ihrer Seite. Persönlich, zuverlässig und mit echtem Engagement für
            Ihre Ziele.
          </motion.p>
        </div>
      </section>

      {/* ─── Services Grid ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {SERVICES.map((s, i) => (
              <motion.article
                key={s.title}
                variants={fadeUp(i * 0.08)} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                className="border border-beige p-8 hover:border-sand transition-colors duration-300"
              >
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
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Wichtige Info ─── */}
      <section className="py-16 px-6 bg-beige">
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

      {/* ─── CTA ─── */}
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
