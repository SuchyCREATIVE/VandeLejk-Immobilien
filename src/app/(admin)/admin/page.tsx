"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquareQuote, Building2, Settings, ArrowRight } from "lucide-react";

type Stats = {
  testimonials: number;
  properties: number;
  activeProperties: number;
};

const CARDS = [
  {
    href: "/admin/kundenstimmen",
    icon: MessageSquareQuote,
    title: "Kundenstimmen",
    desc: "Bewertungen und Referenzen verwalten",
  },
  {
    href: "/admin/erfolgsprojekte",
    icon: Building2,
    title: "Erfolgsprojekte",
    desc: "Objekte anlegen, bearbeiten, deaktivieren",
  },
  {
    href: "/admin/einstellungen",
    icon: Settings,
    title: "Einstellungen",
    desc: "Hero-Bild, Über mich, Kontaktdaten",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="p-10 max-w-4xl">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-2">Willkommen</p>
        <h1 className="text-3xl text-anthrazit-dark">Website verwalten</h1>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-beige p-5">
            <p className="text-2xl font-light text-anthrazit-dark">{stats.testimonials}</p>
            <p className="text-xs text-anthrazit-light mt-1">Kundenstimmen</p>
          </div>
          <div className="bg-white border border-beige p-5">
            <p className="text-2xl font-light text-anthrazit-dark">{stats.properties}</p>
            <p className="text-xs text-anthrazit-light mt-1">Objekte gesamt</p>
          </div>
          <div className="bg-white border border-beige p-5">
            <p className="text-2xl font-light text-anthrazit-dark">{stats.activeProperties}</p>
            <p className="text-xs text-anthrazit-light mt-1">Objekte aktiv</p>
          </div>
        </div>
      )}

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-white border border-beige p-6 hover:border-sand transition-colors duration-200"
          >
            <div className="w-10 h-10 border border-beige flex items-center justify-center mb-5 group-hover:border-sand transition-colors">
              <card.icon size={16} className="text-anthrazit-light" />
            </div>
            <h2 className="text-base text-anthrazit-dark mb-1.5">{card.title}</h2>
            <p className="text-xs text-anthrazit-light leading-relaxed mb-4">{card.desc}</p>
            <span className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-sand group-hover:text-anthrazit transition-colors">
              Öffnen <ArrowRight size={10} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
