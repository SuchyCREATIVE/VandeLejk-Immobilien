"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  sortOrder: number;
  active: boolean;
};

const EMPTY: Omit<Testimonial, "id" | "sortOrder"> = {
  name: "", role: "", text: "", rating: 5, active: true,
};

export default function KundenstimmenAdmin() {
  const [items, setItems]     = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId]   = useState<string | "new" | null>(null);
  const [form, setForm]       = useState<Omit<Testimonial, "id" | "sortOrder">>(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState("");

  async function load() {
    const r = await fetch("/api/admin/testimonials");
    if (r.ok) setItems(await r.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(t: Testimonial) {
    setEditId(t.id);
    setForm({ name: t.name, role: t.role, text: t.text, rating: t.rating, active: t.active });
    setMsg("");
  }

  function startNew() {
    setEditId("new");
    setForm(EMPTY);
    setMsg("");
  }

  function cancel() {
    setEditId(null);
    setMsg("");
  }

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const url  = editId === "new" ? "/api/admin/testimonials" : `/api/admin/testimonials/${editId}`;
      const method = editId === "new" ? "POST" : "PUT";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        await load();
        setEditId(null);
        setMsg(editId === "new" ? "Kundenstimme hinzugefügt." : "Gespeichert.");
      } else {
        setMsg("Fehler beim Speichern.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Kundenstimme wirklich löschen?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    await load();
  }

  async function toggleActive(t: Testimonial) {
    await fetch(`/api/admin/testimonials/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...t, active: !t.active }),
    });
    await load();
  }

  async function move(id: string, dir: "up" | "down") {
    await fetch(`/api/admin/testimonials/${id}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dir }),
    });
    await load();
  }

  if (loading) return <div className="p-10 text-sm text-anthrazit-light">Lädt…</div>;

  return (
    <div className="p-10 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-1">Administration</p>
          <h1 className="text-2xl text-anthrazit-dark">Kundenstimmen</h1>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors"
        >
          <Plus size={13} /> Neue Kundenstimme
        </button>
      </div>

      {msg && <p className="mb-4 text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-2">{msg}</p>}

      {/* ─── Add/Edit Form ─── */}
      {editId && (
        <div className="bg-white border border-beige p-6 mb-6 space-y-4">
          <h2 className="text-sm font-medium text-anthrazit-dark mb-2">
            {editId === "new" ? "Neue Kundenstimme" : "Bearbeiten"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Funktion / Ort</label>
              <input
                type="text"
                placeholder="z.B. Käuferin aus Düsseldorf"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Bewertungstext *</label>
            <textarea
              rows={4}
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Sterne (1–5)</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, rating: s })}
                  className={`w-8 h-8 text-sm border transition-colors ${
                    form.rating >= s ? "bg-anthrazit-dark text-white border-anthrazit-dark" : "border-beige text-anthrazit-light"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-beige">
            <button
              onClick={save}
              disabled={saving || !form.name || !form.text}
              className="flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-50"
            >
              <Check size={13} /> {saving ? "Speichert…" : "Speichern"}
            </button>
            <button
              onClick={cancel}
              className="flex items-center gap-2 border border-beige px-5 py-2 text-[11px] tracking-[0.15em] uppercase text-anthrazit-light hover:border-anthrazit-light transition-colors"
            >
              <X size={13} /> Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* ─── List ─── */}
      {items.length === 0 ? (
        <div className="bg-white border border-beige p-8 text-center text-sm text-anthrazit-light">
          Noch keine Kundenstimmen vorhanden.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((t, i) => (
            <div
              key={t.id}
              className={`bg-white border p-5 flex gap-4 ${t.active ? "border-beige" : "border-beige opacity-50"}`}
            >
              {/* Order controls */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => move(t.id, "up")}
                  disabled={i === 0}
                  className="p-0.5 text-anthrazit-light hover:text-anthrazit disabled:opacity-20"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => move(t.id, "down")}
                  disabled={i === items.length - 1}
                  className="p-0.5 text-anthrazit-light hover:text-anthrazit disabled:opacity-20"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-medium text-anthrazit-dark">{t.name}</span>
                  {t.role && <span className="text-xs text-anthrazit-light">{t.role}</span>}
                  <span className="text-xs text-sand ml-auto shrink-0">{"★".repeat(t.rating)}</span>
                </div>
                <p className="text-xs text-anthrazit-light line-clamp-2 leading-relaxed">{t.text}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => toggleActive(t)}
                  className="p-1.5 text-anthrazit-light hover:text-anthrazit transition-colors"
                  title={t.active ? "Ausblenden" : "Einblenden"}
                >
                  {t.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => startEdit(t)}
                  className="p-1.5 text-anthrazit-light hover:text-anthrazit transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => remove(t.id)}
                  className="p-1.5 text-anthrazit-light hover:text-red-500 transition-colors"
                >
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
