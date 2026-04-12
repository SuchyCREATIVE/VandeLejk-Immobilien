"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";

import { fadeUp, VP } from "@/lib/animations";

/* ─── Zod Schema ──────────────────────────────────────────── */
const schema = z.object({
  name:         z.string().min(2,  "Bitte geben Sie Ihren Namen ein."),
  email:        z.string().email( "Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phone:        z.string().optional(),
  message:      z.string().min(10, "Bitte schreiben Sie eine kurze Nachricht (min. 10 Zeichen)."),
  privacy:      z.literal(true, { error: "Bitte akzeptieren Sie die Datenschutzerklärung." }),
  hp_field:     z.string().max(0).optional(), // honeypot
});

type FormData = z.infer<typeof schema>;

export default function KontaktPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (data.hp_field) return; // bot protection
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setServerError(err.message ?? "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <>
      {/* ─── Page Header ─── */}
      <section className="pt-40 pb-20 px-6 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            variants={fadeUp()} initial="hidden" animate="visible"
            className="text-[10px] tracking-[0.35em] uppercase text-sand mb-5"
          >
            Ich freue mich auf Sie
          </motion.p>
          <motion.h1
            variants={fadeUp(0.1)} initial="hidden" animate="visible"
            className="text-4xl md:text-5xl text-anthrazit-dark mb-6"
          >
            Kontakt
          </motion.h1>
          <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.5 } } }}
            initial="hidden" animate="visible"
            className="w-12 h-px bg-sand mx-auto mb-8 origin-left"
          />
          <motion.p
            variants={fadeUp(0.2)} initial="hidden" animate="visible"
            className="text-[15px] leading-relaxed text-anthrazit-light max-w-lg mx-auto"
          >
            Haben Sie eine Frage, möchten ein Erstgespräch vereinbaren oder ein
            konkretes Objekt anfragen? Schreiben Sie mir – ich antworte schnell
            und persönlich.
          </motion.p>
        </div>
      </section>

      {/* ─── Content: Info + Form ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[400px_1fr] gap-16">

          {/* Left: Portrait + Kontaktdaten */}
          <motion.div
            variants={fadeUp(0)} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Portrait */}
            <div className="relative aspect-[4/5] overflow-hidden mb-8">
              <Image
                src="/images/vanessa/portrait.jpg"
                alt="Vanessa Lejk"
                fill
                className="object-cover object-top"
                sizes="400px"
              />
            </div>

            <h2 className="text-2xl text-anthrazit-dark mb-1">Vanessa Lejk</h2>
            <p className="text-sm text-anthrazit-light mb-6">
              Immobilienmaklerin · VandeLejk Immobilien
            </p>

            <ul className="space-y-4">
              {[
                { icon: MapPin, text: "Niedenstraße 113, 40721 Hilden" },
                { icon: Phone,  text: "Auf Anfrage", href: "tel:+49" },
                { icon: Mail,   text: "Auf Anfrage",  href: "mailto:kontakt@vandelejk-immobilien.de" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-anthrazit-light">
                  <item.icon size={15} className="text-sand mt-0.5 flex-shrink-0" />
                  {item.href ? (
                    <a href={item.href} className="hover:text-anthrazit transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 p-5 bg-cream">
              <p className="text-sm leading-relaxed text-anthrazit-light italic">
                „Ich nehme mir die Zeit, die Ihr Anliegen verdient.
                Bei mir sind Sie in guten Händen."
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-anthrazit mt-3">
                Vanessa Lejk
              </p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            variants={fadeUp(0.1)} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
          >
            {submitted ? (
              <div className="flex flex-col items-start justify-center h-full py-12">
                <CheckCircle2 size={40} className="text-sand mb-6" />
                <h2 className="text-3xl text-anthrazit-dark mb-4">
                  Vielen Dank!
                </h2>
                <p className="text-[15px] leading-relaxed text-anthrazit-light max-w-md">
                  Ihre Nachricht wurde erfolgreich übermittelt. Ich melde mich so
                  schnell wie möglich bei Ihnen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Honeypot – hidden */}
                <input
                  {...register("hp_field")}
                  type="text"
                  name="hp_field"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                {/* Name */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-anthrazit mb-2">
                    Name *
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Ihr vollständiger Name"
                    className="w-full border border-beige bg-white px-4 py-3 text-sm text-anthrazit placeholder-sand focus:border-anthrazit-light focus:outline-none transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* E-Mail + Telefon */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-anthrazit mb-2">
                      E-Mail *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="ihre@email.de"
                      className="w-full border border-beige bg-white px-4 py-3 text-sm text-anthrazit placeholder-sand focus:border-anthrazit-light focus:outline-none transition-colors"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-anthrazit mb-2">
                      Telefon <span className="text-sand normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+49 ..."
                      className="w-full border border-beige bg-white px-4 py-3 text-sm text-anthrazit placeholder-sand focus:border-anthrazit-light focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Nachricht */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-anthrazit mb-2">
                    Ihre Nachricht *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    placeholder="Wie kann ich Ihnen helfen? Bitte beschreiben Sie Ihr Anliegen..."
                    className="w-full border border-beige bg-white px-4 py-3 text-sm text-anthrazit placeholder-sand focus:border-anthrazit-light focus:outline-none transition-colors resize-none"
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>

                {/* Datenschutz */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      {...register("privacy")}
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 border-beige accent-anthrazit"
                    />
                    <span className="text-xs text-anthrazit-light leading-relaxed">
                      Ich habe die{" "}
                      <a href="/datenschutz" target="_blank" className="underline hover:text-anthrazit transition-colors">
                        Datenschutzerklärung
                      </a>{" "}
                      gelesen und bin damit einverstanden, dass meine Daten zur
                      Bearbeitung meiner Anfrage verwendet werden. *
                    </span>
                  </label>
                  {errors.privacy && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.privacy.message}</p>
                  )}
                </div>

                {/* Server Error */}
                {serverError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
                    {serverError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-anthrazit text-white px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:bg-anthrazit-dark transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Wird gesendet…" : "Nachricht senden"}
                  {!isSubmitting && <Send size={13} />}
                </button>

                <p className="text-xs text-anthrazit-light">
                  * Pflichtfelder. Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
