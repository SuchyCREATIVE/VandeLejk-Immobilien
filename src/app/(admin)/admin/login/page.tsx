"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Benutzername oder Passwort falsch.");
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
          <h1 className="text-2xl text-anthrazit-dark mb-1">Administration</h1>
          <p className="text-sm text-anthrazit-light">Bitte melden Sie sich an</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Benutzername oder E-Mail"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="w-full border border-beige bg-white px-4 py-3 text-sm text-anthrazit placeholder-sand focus:border-anthrazit-light focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-beige bg-white px-4 py-3 text-sm text-anthrazit placeholder-sand focus:border-anthrazit-light focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sand hover:text-anthrazit"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2">{error}</p>
          )}

          <div className="text-right">
            <Link href="/admin/vergessen" className="text-xs text-anthrazit-light hover:text-anthrazit transition-colors">
              Passwort vergessen?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-anthrazit-dark text-white py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-60"
          >
            {loading ? "Wird angemeldet…" : "Anmelden"}
          </button>
        </form>

        <p className="text-center text-xs text-sand mt-8">
          VandeLejk Immobilien · Interne Verwaltung
        </p>
      </div>
    </div>
  );
}
