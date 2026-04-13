"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswortAendernPage() {
  const router = useRouter();
  const { update } = useSession();

  const [pw,      setPw]      = useState("");
  const [pw2,     setPw2]     = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pw !== pw2) { setError("Die Passwörter stimmen nicht überein."); return; }
    if (pw.length < 8) { setError("Mindestens 8 Zeichen erforderlich."); return; }

    setLoading(true);
    const r = await fetch("/api/admin/auth/change-password", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ newPassword: pw }),
    });
    setLoading(false);

    if (r.ok) {
      await update({ mustChangePassword: false });
      router.push("/admin");
      router.refresh();
    } else {
      const d = await r.json();
      setError(d.error ?? "Fehler beim Speichern.");
    }
  }

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
          <h1 className="text-2xl text-anthrazit-dark mb-1">Passwort setzen</h1>
          <p className="text-sm text-anthrazit-light leading-relaxed">
            Bitte legen Sie bei Ihrer ersten Anmeldung ein eigenes Passwort fest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { val: pw,  set: setPw,  ph: "Neues Passwort" },
            { val: pw2, set: setPw2, ph: "Passwort wiederholen" },
          ].map(({ val, set, ph }) => (
            <div key={ph} className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder={ph}
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
            {loading ? "Wird gespeichert…" : "Passwort speichern & einloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
