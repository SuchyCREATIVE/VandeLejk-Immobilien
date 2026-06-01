"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import { fadeUp, VP } from "@/lib/animations";

/* ─── Zod Schema ──────────────────────────────────────────── */
const schema = z.object({
  firstname: z.string().min(2,  "Bitte geben Sie Ihren Vornamen ein."),
  lastname:  z.string().min(2,  "Bitte geben Sie Ihren Nachnamen ein."),
  email:     z.string().email(  "Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phone:     z.string().min(6,  "Bitte geben Sie Ihre Telefonnummer ein."),
  message:   z.string().min(10, "Bitte schreiben Sie eine kurze Nachricht (min. 10 Zeichen)."),
  privacy:   z.literal(true, { error: "Bitte akzeptieren Sie die Datenschutzerklärung." }),
  hp_field:  z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

/* ─── Cloudflare Turnstile (global script API) ────────────── */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const inputCls =
  "w-full border border-beige bg-white px-4 py-3.5 text-sm text-anthrazit placeholder-sand/70 focus:border-anthrazit-light focus:outline-none transition-colors duration-200";
const labelCls = "block text-[10px] tracking-[0.2em] uppercase text-anthrazit mb-2";

export default function KontaktPage() {
  const [submitted,   setSubmitted]   = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Turnstile (im Admin schaltbar)
  const [turnstileCfg, setTurnstileCfg] = useState<{ enabled: boolean; siteKey: string }>({ enabled: false, siteKey: "" });
  const [captchaToken, setCaptchaToken] = useState("");
  const widgetRef   = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/turnstile")
      .then((r) => r.json())
      .then((d) => setTurnstileCfg({ enabled: !!d.enabled, siteKey: d.siteKey ?? "" }))
      .catch(() => {});
  }, []);

  function renderTurnstile() {
    const ts = window.turnstile;
    if (!ts || widgetIdRef.current !== null || !widgetRef.current) return;
    if (!turnstileCfg.enabled || !turnstileCfg.siteKey) return;
    widgetIdRef.current = ts.render(widgetRef.current, {
      sitekey: turnstileCfg.siteKey,
      callback: (t: string) => setCaptchaToken(t),
      "error-callback": () => setCaptchaToken(""),
      "expired-callback": () => setCaptchaToken(""),
    });
  }

  // Falls das Script schon geladen war, als die Config eintraf
  useEffect(() => {
    if (turnstileCfg.enabled && turnstileCfg.siteKey) renderTurnstile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnstileCfg]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (data.hp_field) return;
    setServerError(null);

    if (turnstileCfg.enabled && !captchaToken) {
      setServerError("Bitte bestätigen Sie, dass Sie kein Roboter sind.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken: captchaToken }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setServerError(err.message ?? "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
        // Turnstile-Token ist einmalig gültig – Widget für neuen Versuch zurücksetzen
        if (window.turnstile && widgetIdRef.current !== null) {
          window.turnstile.reset(widgetIdRef.current);
          setCaptchaToken("");
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <>
      {turnstileCfg.enabled && turnstileCfg.siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      )}

      {/* ─── Page Header ─── */}
      <section className="pt-36 pb-20 px-6 bg-cream">
        <div className="max-w-4xl mx-auto">
          <motion.p
            variants={fadeUp()} initial="hidden" animate="visible"
            className="text-[10px] tracking-[0.35em] uppercase text-sand mb-4"
          >
            Ich freue mich auf Sie
          </motion.p>
          <motion.h1
            variants={fadeUp(0.1)} initial="hidden" animate="visible"
            className="text-4xl md:text-5xl text-anthrazit-dark mb-0"
          >
            Kontakt aufnehmen
          </motion.h1>
        </div>
      </section>

      {/* ─── Content: Info + Form ─── */}
      <section className="py-0 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-[360px_1fr] gap-16 py-16">

            {/* Left: Portrait + Kontaktdaten */}
            <motion.div
              variants={fadeUp(0)} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Portrait – rund */}
              <div className="relative w-56 h-56 mx-auto rounded-full overflow-hidden mb-8">
                <Image
                  src="/images/vanessa/vanessa-front.webp"
                  alt="Vanessa Lejk"
                  fill
                  quality={80}
                  className="object-cover object-top"
                  sizes="224px"
                />
              </div>

              <h2 className="text-xl text-anthrazit-dark mb-1">Vanessa Lejk</h2>
              <p className="text-sm text-anthrazit-light mb-8">
                Immobilienmaklerin · VandeLejk Immobilien
              </p>

              <div className="space-y-3 mb-8">
                <a
                  href="tel:+4915775299523"
                  className="flex items-start gap-3 text-sm text-anthrazit-light hover:text-anthrazit transition-colors"
                >
                  <Phone size={14} className="text-sand mt-0.5 shrink-0" />
                  0157 752 995 23
                </a>
                <a
                  href="mailto:info@vandelejk-immobilien.de"
                  className="flex items-start gap-3 text-sm text-anthrazit-light hover:text-anthrazit transition-colors"
                >
                  <Mail size={14} className="text-sand mt-0.5 shrink-0" />
                  info@vandelejk-immobilien.de
                </a>
              </div>

              <div className="bg-cream px-6 py-5">
                <p className="text-sm leading-relaxed text-anthrazit-light">
                  „Ich nehme mir die Zeit, die Ihr Anliegen verdient.
                  Bei mir sind Sie in guten Händen."
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-anthrazit mt-3">
                  — Vanessa Lejk
                </p>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              variants={fadeUp(0.1)} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
            >
              {submitted ? (
                <div className="flex flex-col items-start justify-center h-full py-16">
                  <div className="w-14 h-14 border border-sand flex items-center justify-center mb-8">
                    <CheckCircle2 size={22} className="text-sand" />
                  </div>
                  <h2 className="text-3xl text-anthrazit-dark mb-4">
                    Vielen Dank!
                  </h2>
                  <p className="text-[15px] leading-relaxed text-anthrazit-light max-w-md">
                    Ihre Nachricht wurde erfolgreich übermittelt. Ich melde mich so
                    schnell wie möglich bei Ihnen.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {/* Honeypot (Spam-Falle) – für Menschen unsichtbar, aber mit
                      Accessible Name, damit Screenreader/Audits es einordnen können */}
                  <input
                    {...register("hp_field")}
                    id="hp_field"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-label="Dieses Feld bitte leer lassen"
                    className="hidden"
                  />

                  {/* Vorname + Nachname */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstname" className={labelCls}>Vorname *</label>
                      <input
                        {...register("firstname")}
                        id="firstname"
                        type="text"
                        placeholder="Vorname"
                        className={inputCls}
                      />
                      {errors.firstname && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.firstname.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastname" className={labelCls}>Nachname *</label>
                      <input
                        {...register("lastname")}
                        id="lastname"
                        type="text"
                        placeholder="Nachname"
                        className={inputCls}
                      />
                      {errors.lastname && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.lastname.message}</p>
                      )}
                    </div>
                  </div>

                  {/* E-Mail + Telefon */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className={labelCls}>E-Mail *</label>
                      <input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="ihre@email.de"
                        className={inputCls}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelCls}>Telefon *</label>
                      <input
                        {...register("phone")}
                        id="phone"
                        type="tel"
                        placeholder="+49 211 ..."
                        className={inputCls}
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Nachricht */}
                  <div>
                    <label htmlFor="message" className={labelCls}>Ihre Nachricht *</label>
                    <textarea
                      {...register("message")}
                      id="message"
                      rows={6}
                      placeholder="Wie kann ich Ihnen helfen? Bitte beschreiben Sie Ihr Anliegen…"
                      className={`${inputCls} resize-none`}
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
                        className="mt-0.5 w-4 h-4 border-beige accent-anthrazit shrink-0"
                      />
                      <span className="text-xs text-anthrazit-light leading-relaxed">
                        Ich habe die{" "}
                        <a href="/datenschutz" target="_blank" className="underline hover:text-anthrazit transition-colors">
                          Datenschutzerklärung
                        </a>{" "}
                        gelesen und stimme der Verwendung meiner Daten zur Bearbeitung dieser
                        Anfrage zu. *
                      </span>
                    </label>
                    {errors.privacy && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.privacy.message}</p>
                    )}
                  </div>

                  {/* Cloudflare Turnstile */}
                  {turnstileCfg.enabled && turnstileCfg.siteKey && (
                    <div ref={widgetRef} className="min-h-[65px]" />
                  )}

                  {/* Server Error */}
                  {serverError && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
                      {serverError}
                    </div>
                  )}

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 bg-anthrazit-dark text-white px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:bg-anthrazit transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Wird gesendet…" : "Nachricht absenden"}
                      {!isSubmitting && <Send size={13} />}
                    </button>
                    <p className="text-xs text-anthrazit-light mt-4">
                      * Pflichtfelder · Ihre Daten werden vertraulich behandelt.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
