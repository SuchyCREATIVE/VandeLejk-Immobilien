"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";

function ResetForm() {
  const params  = useSearchParams();
  const router  = useRouter();
  const token   = params.get("token") ?? "";

  const [pw,      setPw]      = useState("");
  const [pw2,     setPw2]     = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pw !== pw2) { setError("Die Passwörter stimmen nicht überein."); return; }
    if (pw.length < 8) { setError("Mindestens 8 Zeichen erforderlich."); return; }
    setLoading(true);
    const r = await fetch("/api/admin/auth/reset-password", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ token, password: pw }),
    });
    setLoading(false);
    if (r.ok) { setDone(true); setTimeout(() => router.push("/admin/login"), 2500); }
    else { const d = await r.json(); setError(d.error ?? "Fehler."); }
  }

  if (!token) return (
    <p className="text-sm text-red-500 text-center">
      Ungültiger Link. Bitte fordern Sie einen neuen an.
    </p>
  );

  if (done) return (
    <div className="bg-white border border-beige p-6 text-center space-y-3">
      <p className="text-sm text-anthrazit-light">Passwort erfolgreich geändert.</p>
      <p className="text-xs text-sand">Sie werden weitergeleitet…</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { val: pw,  set: setPw,  label: "Neues Passwort" },
        { val: pw2, set: setPw2, label: "Passwort wiederholen" },
      ].map(({ val, set, label }) => (
        <div key={label} className="relative">
          <input
            type={showPw ? "text" : "password"}
            placeholder={label}
            value={val}
            onChange={(e) => set(e.target.value)}
            required
            className="w-full border border-beige bg-white px-4 py-3 text-sm text-anthrazit placeholder-sand focus:border-anthrazit-light focus:outline-none pr-10"
          />
          <button type="button" onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sand hover:text-anthrazit">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      ))}
      <p className="text-xs text-anthrazit-light">Mindestens 8 Zeichen.</p>
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full bg-anthrazit-dark text-white py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-60">
        {loading ? "Wird gespeichert…" : "Passwort speichern"}
      </button>
    </form>
  );
}

export default function ResetPasswortPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="relative w-36 h-9 mx-auto mb-8">
            <Image src="/Logo/SVG/VandeLejk-Logo-schwarz.svg" alt="VandeLejk" fill className="object-contain" />
          </div>
          <div className="w-10 h-10 border border-sand flex items-center justify-center mx-auto mb-5">
            <Lock size={16} className="text-anthrazit-light" />
          </div>
          <h1 className="text-2xl text-anthrazit-dark mb-1">Neues Passwort</h1>
          <p className="text-sm text-anthrazit-light">Bitte wählen Sie ein sicheres Passwort.</p>
        </div>
        <Suspense>
          <ResetForm />
        </Suspense>
        <Link href="/admin/login"
          className="flex items-center justify-center gap-2 mt-6 text-xs text-anthrazit-light hover:text-anthrazit transition-colors">
          Zurück zum Login
        </Link>
      </div>
    </div>
  );
}
