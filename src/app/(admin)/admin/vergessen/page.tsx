"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft } from "lucide-react";

export default function PasswortVergessenPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await fetch("/api/admin/auth/forgot-password", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email }),
    });
    // Immer Erfolg zeigen (kein User-Enumeration)
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="relative w-36 h-9 mx-auto mb-8">
            <Image src="/Logo/SVG/VandeLejk-Logo-schwarz.svg" alt="VandeLejk" fill className="object-contain" />
          </div>
          <div className="w-10 h-10 border border-sand flex items-center justify-center mx-auto mb-5">
            <Mail size={16} className="text-anthrazit-light" />
          </div>
          <h1 className="text-2xl text-anthrazit-dark mb-1">Passwort zurücksetzen</h1>
          <p className="text-sm text-anthrazit-light">Wir senden Ihnen einen Reset-Link per E-Mail.</p>
        </div>

        {sent ? (
          <div className="bg-white border border-beige p-6 text-center space-y-4">
            <p className="text-sm text-anthrazit-light leading-relaxed">
              Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir einen Link zum
              Zurücksetzen des Passworts gesendet. Bitte prüfen Sie auch Ihren Spam-Ordner.
            </p>
            <p className="text-xs text-sand">Der Link ist 2 Stunden gültig.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-beige bg-white px-4 py-3 text-sm text-anthrazit placeholder-sand focus:border-anthrazit-light focus:outline-none"
            />
            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-anthrazit-dark text-white py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-60"
            >
              {loading ? "Wird gesendet…" : "Link senden"}
            </button>
          </form>
        )}

        <Link
          href="/admin/login"
          className="flex items-center justify-center gap-2 mt-6 text-xs text-anthrazit-light hover:text-anthrazit transition-colors"
        >
          <ArrowLeft size={12} /> Zurück zum Login
        </Link>
      </div>
    </div>
  );
}
