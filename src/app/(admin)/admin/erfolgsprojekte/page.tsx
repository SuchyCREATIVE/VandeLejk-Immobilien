"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Property = {
  id: string;
  address: string;
  city: string;
  type: string;
  status: string;
  price: string;
  photos: string[];
  active: boolean;
};

export default function ImmobilienAdmin() {
  const [items, setItems]     = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function load() {
    const r = await fetch("/api/admin/properties");
    if (r.ok) setItems(await r.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function toggleActive(p: Property) {
    await fetch(`/api/admin/properties/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, active: !p.active }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Objekt wirklich löschen?")) return;
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    await load();
  }

  if (loading) return <div className="p-10 text-sm text-anthrazit-light">Lädt…</div>;

  return (
    <div className="p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-1">Administration</p>
          <h1 className="text-2xl text-anthrazit-dark">Erfolgsprojekte</h1>
        </div>
        <button
          onClick={() => router.push("/admin/erfolgsprojekte/neu")}
          className="flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors"
        >
          <Plus size={13} /> Neues Objekt
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-beige p-8 text-center text-sm text-anthrazit-light">
          Noch keine Objekte vorhanden.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((p) => (
            <div
              key={p.id}
              className={`bg-white border p-5 flex gap-4 items-center ${p.active ? "border-beige" : "border-beige opacity-50"}`}
            >
              {p.photos[0] && (
                <div className="relative w-20 h-14 shrink-0 border border-beige overflow-hidden">
                  <Image src={p.photos[0]} alt="" fill className="object-cover" sizes="80px" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-anthrazit-dark">{p.address}</p>
                <p className="text-xs text-anthrazit-light">{p.city} · {p.type} · {p.price}</p>
                <p className="text-xs text-sand mt-0.5">{p.photos.length} Foto{p.photos.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[9px] tracking-widest uppercase px-2 py-1 ${p.active ? "bg-green-50 text-green-700" : "bg-beige text-anthrazit-light"}`}>
                  {p.active ? "Aktiv" : "Inaktiv"}
                </span>
                <button onClick={() => toggleActive(p)} className="p-1.5 text-anthrazit-light hover:text-anthrazit transition-colors" title={p.active ? "Deaktivieren" : "Aktivieren"}>
                  {p.active ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => router.push(`/admin/immobilien/${p.id}`)} className="p-1.5 text-anthrazit-light hover:text-anthrazit transition-colors" title="Bearbeiten">
                  <Pencil size={14} />
                </button>
                <button onClick={() => remove(p.id)} className="p-1.5 text-anthrazit-light hover:text-red-500 transition-colors" title="Löschen">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
