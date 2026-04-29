"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Upload, Check, ToggleLeft, ToggleRight, Send } from "lucide-react";

type Settings = {
  immobilien_active: boolean;
  hero_image: string;
  ueber_mich_text: string;
  kontakt_telefon: string;
  kontakt_email: string;
  kontakt_adresse: string;
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass: string;
  smtp_from: string;
  smtp_from_name: string;
};

const DEFAULT: Settings = {
  immobilien_active: true,
  hero_image: "/images/hero.webp",
  ueber_mich_text: "",
  kontakt_telefon: "",
  kontakt_email: "",
  kontakt_adresse: "",
  smtp_host: "",
  smtp_port: "587",
  smtp_user: "",
  smtp_pass: "",
  smtp_from: "",
  smtp_from_name: "VandeLejk Immobilien",
};

export default function EinstellungenAdmin() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [loading, setLoading]   = useState(true);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [saving, setSaving]     = useState<string | null>(null);
  const [msgs, setMsgs]         = useState<Record<string, string>>({});
  const heroRef = useRef<HTMLInputElement>(null);

  async function load() {
    const r = await fetch("/api/admin/settings");
    if (r.ok) {
      const data = await r.json();
      setSettings((s) => ({ ...s, ...data }));
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function saveSetting(key: keyof Settings, value: unknown) {
    setSaving(key);
    const r = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSaving(null);
    setMsgs((m) => ({ ...m, [key]: r.ok ? "Gespeichert ✓" : "Fehler beim Speichern." }));
    setTimeout(() => setMsgs((m) => ({ ...m, [key]: "" })), 3000);
  }

  async function uploadHero() {
    if (!heroFile) return;
    setSaving("hero_image");
    const fd = new FormData();
    fd.append("file", heroFile);
    const r = await fetch("/api/admin/hero-image", { method: "POST", body: fd });
    setSaving(null);
    if (r.ok) {
      const data = await r.json();
      setSettings((s) => ({ ...s, hero_image: data.value }));
      setHeroFile(null);
      setHeroPreview(null);
      if (heroRef.current) heroRef.current.value = "";
      setMsgs((m) => ({ ...m, hero_image: "Hero-Bild aktualisiert ✓" }));
      setTimeout(() => setMsgs((m) => ({ ...m, hero_image: "" })), 3000);
    } else {
      setMsgs((m) => ({ ...m, hero_image: "Fehler beim Upload." }));
    }
  }

  if (loading) return <div className="p-10 text-sm text-anthrazit-light">Lädt…</div>;

  return (
    <div className="p-10 max-w-2xl space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-1">Administration</p>
        <h1 className="text-2xl text-anthrazit-dark">Einstellungen</h1>
      </div>

      {/* ─── Immobilien Toggle ─── */}
      <section className="bg-white border border-beige p-6">
        <h2 className="text-sm font-medium text-anthrazit-dark mb-4 pb-3 border-b border-beige">Immobilienangebote</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-anthrazit-dark mb-0.5">
              {settings.immobilien_active ? "Seite ist sichtbar" : "Seite ist ausgeblendet"}
            </p>
            <p className="text-xs text-anthrazit-light">
              {settings.immobilien_active
                ? "Die Seite /immobilien zeigt aktuelle Objekte."
                : "Besucher sehen eine Hinweisseite."}
            </p>
          </div>
          <button
            onClick={() => {
              const newVal = !settings.immobilien_active;
              setSettings((s) => ({ ...s, immobilien_active: newVal }));
              saveSetting("immobilien_active", newVal);
            }}
            className="ml-6 shrink-0 transition-colors"
          >
            {settings.immobilien_active
              ? <ToggleRight size={44} className="text-anthrazit-dark" />
              : <ToggleLeft  size={44} className="text-sand" />}
          </button>
        </div>
        {msgs.immobilien_active && <p className="mt-3 text-xs text-green-700">{msgs.immobilien_active}</p>}
      </section>

      {/* ─── Hero-Bild ─── */}
      <section className="bg-white border border-beige p-6">
        <h2 className="text-sm font-medium text-anthrazit-dark mb-4 pb-3 border-b border-beige">Hero-Bild (Startseite)</h2>
        {settings.hero_image && (
          <div className="relative aspect-[16/7] overflow-hidden border border-beige mb-4">
            <Image src={settings.hero_image} alt="Hero" fill className="object-cover" sizes="700px" />
          </div>
        )}
        <label className="flex items-center gap-3 border-2 border-dashed border-beige hover:border-sand cursor-pointer bg-[#f5f4f1] px-5 py-4 mb-3 transition-colors">
          <Upload size={16} className="text-sand" />
          <span className="text-sm text-anthrazit-light">
            {heroFile ? heroFile.name : "Neues Bild auswählen (JPG, PNG · empfohlen 1920×1080)"}
          </span>
          <input
            ref={heroRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { setHeroFile(f); setHeroPreview(URL.createObjectURL(f)); }
            }}
            className="hidden"
          />
        </label>
        {heroPreview && (
          <div className="relative aspect-[16/7] overflow-hidden border border-beige mb-3">
            <Image src={heroPreview} alt="Vorschau" fill className="object-cover" sizes="700px" />
            <span className="absolute top-2 left-2 bg-anthrazit-dark/70 text-white text-[9px] px-2 py-0.5 tracking-widest">Vorschau</span>
          </div>
        )}
        {msgs.hero_image && <p className="mb-2 text-xs text-green-700">{msgs.hero_image}</p>}
        <button
          onClick={uploadHero}
          disabled={!heroFile || saving === "hero_image"}
          className="flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-50"
        >
          <Upload size={13} /> {saving === "hero_image" ? "Wird hochgeladen…" : "Bild speichern"}
        </button>
      </section>

      {/* ─── Über mich Text ─── */}
      <section className="bg-white border border-beige p-6">
        <h2 className="text-sm font-medium text-anthrazit-dark mb-4 pb-3 border-b border-beige">Über mich – Text</h2>
        <textarea
          rows={6}
          value={settings.ueber_mich_text}
          onChange={(e) => setSettings((s) => ({ ...s, ueber_mich_text: e.target.value }))}
          className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none resize-none mb-3"
          placeholder="Kurzbeschreibung über Vanessa…"
        />
        {msgs.ueber_mich_text && <p className="mb-2 text-xs text-green-700">{msgs.ueber_mich_text}</p>}
        <button
          onClick={() => saveSetting("ueber_mich_text", settings.ueber_mich_text)}
          disabled={saving === "ueber_mich_text"}
          className="flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-50"
        >
          <Check size={13} /> {saving === "ueber_mich_text" ? "Speichert…" : "Speichern"}
        </button>
      </section>

      {/* ─── Kontaktdaten ─── */}
      <section className="bg-white border border-beige p-6">
        <h2 className="text-sm font-medium text-anthrazit-dark mb-4 pb-3 border-b border-beige">Kontaktdaten</h2>
        <div className="space-y-4">
          {[
            { key: "kontakt_telefon", label: "Telefon",   placeholder: "+49 211 …" },
            { key: "kontakt_email",   label: "E-Mail",    placeholder: "info@vandelejk-immobilien.de" },
            { key: "kontakt_adresse", label: "Adresse",   placeholder: "Musterstraße 1, 40210 Düsseldorf" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">{label}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={placeholder}
                  value={(settings as Record<string, unknown>)[key] as string}
                  onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                  className="flex-1 border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none"
                />
                <button
                  onClick={() => saveSetting(key as keyof Settings, (settings as Record<string, unknown>)[key])}
                  disabled={saving === key}
                  className="flex items-center gap-1.5 bg-anthrazit-dark text-white px-4 py-2 text-[10px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-50"
                >
                  <Check size={12} /> {saving === key ? "…" : "OK"}
                </button>
              </div>
              {msgs[key] && <p className="mt-1 text-xs text-green-700">{msgs[key]}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ─── SMTP ─── */}
      <section className="bg-white border border-beige p-6">
        <h2 className="text-sm font-medium text-anthrazit-dark mb-1 pb-3 border-b border-beige">E-Mail / SMTP</h2>
        <p className="text-xs text-anthrazit-light mb-4 mt-3 leading-relaxed">
          Wird für Einladungen und Passwort-Reset-Mails verwendet.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { key: "smtp_host",      label: "SMTP-Server",    placeholder: "mail.example.de",          span: false },
            { key: "smtp_port",      label: "Port",           placeholder: "587",                      span: false },
            { key: "smtp_user",      label: "Benutzername",   placeholder: "info@vandelejk-immobilien.de", span: false },
            { key: "smtp_pass",      label: "Passwort",       placeholder: "••••••••",                 span: false },
            { key: "smtp_from",      label: "Absender-Adresse", placeholder: "noreply@vandelejk-immobilien.de", span: false },
            { key: "smtp_from_name", label: "Absendername",   placeholder: "VandeLejk Immobilien",     span: false },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">{label}</label>
              <input
                type={key === "smtp_pass" ? "password" : "text"}
                placeholder={placeholder}
                value={(settings as Record<string, unknown>)[key] as string}
                onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none"
              />
            </div>
          ))}
        </div>
        {msgs.smtp_host && <p className="mb-2 text-xs text-green-700">{msgs.smtp_host}</p>}
        <button
          onClick={async () => {
            for (const key of ["smtp_host","smtp_port","smtp_user","smtp_pass","smtp_from","smtp_from_name"] as (keyof Settings)[]) {
              await saveSetting(key, (settings as Record<string, unknown>)[key as string]);
            }
          }}
          disabled={!!saving}
          className="flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-50"
        >
          <Check size={13} /> {saving ? "Speichert…" : "SMTP speichern"}
        </button>
      </section>
    </div>
  );
}
