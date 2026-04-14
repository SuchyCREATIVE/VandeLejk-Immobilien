"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, Check, X, Eye, EyeOff,
  Upload, GripVertical, RotateCw
} from "lucide-react";

type Property = {
  id: string;
  address: string;
  city: string;
  type: string;
  status: string;
  price: string;
  area: string;
  rooms: number;
  bathrooms: number;
  floor: string;
  yearBuilt: string;
  description: string;
  highlights: string[];
  photos: string[];
  active: boolean;
  sortOrder: number;
};

type FormData = Omit<Property, "id" | "sortOrder">;

const EMPTY_FORM: FormData = {
  address: "", city: "", type: "Eigentumswohnung", status: "Verfügbar",
  price: "auf Anfrage", area: "", rooms: 3, bathrooms: 1,
  floor: "", yearBuilt: "", description: "",
  highlights: [], photos: [], active: true,
};

export default function ImmobilienAdmin() {
  const [items, setItems]       = useState<Property[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editId, setEditId]     = useState<string | "new" | null>(null);
  const [form, setForm]         = useState<FormData>(EMPTY_FORM);
  const [highlightInput, setHighlightInput] = useState("");
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]           = useState("");
  const fileRef     = useRef<HTMLInputElement>(null);
  const [dragging,  setDragging]  = useState<number | null>(null);
  const [dragOver,  setDragOver]  = useState<number | null>(null);
  const [rotating,  setRotating]  = useState<number | null>(null);
  const draggingRef = useRef<number | null>(null);

  async function load() {
    const r = await fetch("/api/admin/properties");
    if (r.ok) setItems(await r.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function startEdit(p: Property) {
    setEditId(p.id);
    setForm({
      address: p.address, city: p.city, type: p.type, status: p.status,
      price: p.price, area: p.area, rooms: p.rooms, bathrooms: p.bathrooms,
      floor: p.floor, yearBuilt: p.yearBuilt, description: p.description,
      highlights: p.highlights, photos: p.photos, active: p.active,
    });
    setMsg("");
  }

  function startNew() {
    setEditId("new");
    setForm(EMPTY_FORM);
    setHighlightInput("");
    setMsg("");
  }

  function cancel() { setEditId(null); setMsg(""); }

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const url    = editId === "new" ? "/api/admin/properties" : `/api/admin/properties/${editId}`;
      const method = editId === "new" ? "POST" : "PUT";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        await load();
        setEditId(null);
        setMsg(editId === "new" ? "Objekt angelegt." : "Gespeichert.");
      } else {
        setMsg("Fehler beim Speichern.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Objekt wirklich löschen?")) return;
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    await load();
  }

  async function toggleActive(p: Property) {
    await fetch(`/api/admin/properties/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, active: !p.active }),
    });
    await load();
  }

  async function uploadPhotos(files: FileList) {
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const r = await fetch("/api/admin/property-photos", { method: "POST", body: fd });
      if (r.ok) {
        const { paths } = await r.json();
        setForm((f) => ({ ...f, photos: [...f.photos, ...paths] }));
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removePhoto(idx: number) {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));
  }

  function movePhoto(idx: number, dir: "left" | "right") {
    const photos = [...form.photos];
    const target = dir === "left" ? idx - 1 : idx + 1;
    [photos[idx], photos[target]] = [photos[target], photos[idx]];
    setForm((f) => ({ ...f, photos }));
  }

  // Pointer-Event DnD mit elementFromPoint – funktioniert in Chrome, Firefox, Safari
  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (draggingRef.current === null) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const tile = el?.closest("[data-photo-idx]") as HTMLElement | null;
      const idx = tile ? parseInt(tile.dataset.photoIdx!) : null;
      setDragOver(idx);
    }
    function onPointerUp(e: PointerEvent) {
      if (draggingRef.current === null) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const tile = el?.closest("[data-photo-idx]") as HTMLElement | null;
      const targetIdx = tile ? parseInt(tile.dataset.photoIdx!) : null;
      const fromIdx = draggingRef.current;
      if (targetIdx !== null && targetIdx !== fromIdx) {
        setForm((f) => {
          const photos = [...f.photos];
          const [moved] = photos.splice(fromIdx, 1);
          photos.splice(targetIdx, 0, moved);
          return { ...f, photos };
        });
      }
      draggingRef.current = null;
      setDragging(null);
      setDragOver(null);
    }
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  function onPhotoPointerDown(idx: number, e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault(); // verhindert Browser-Standard-Drag (Bild öffnen in Firefox)
    draggingRef.current = idx;
    setDragging(idx);
    setDragOver(idx);
  }

  async function rotatePhoto(idx: number) {
    const src = form.photos[idx].split("?")[0];
    setRotating(idx);
    try {
      const r = await fetch("/api/admin/property-photos/rotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoPath: src }),
      });
      if (r.ok) {
        const { newPath } = await r.json();
        // Pfad in form.photos ersetzen → neuer Name umgeht Next.js Image-Cache
        setForm((f) => {
          const photos = [...f.photos];
          photos[idx] = newPath;
          return { ...f, photos };
        });
      }
    } finally {
      setRotating(null);
    }
  }

  function addHighlight() {
    const v = highlightInput.trim();
    if (v) {
      setForm((f) => ({ ...f, highlights: [...f.highlights, v] }));
      setHighlightInput("");
    }
  }

  if (loading) return <div className="p-10 text-sm text-anthrazit-light">Lädt…</div>;

  return (
    <div className="p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-1">Administration</p>
          <h1 className="text-2xl text-anthrazit-dark">Immobilien</h1>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors"
        >
          <Plus size={13} /> Neues Objekt
        </button>
      </div>

      {msg && <p className="mb-4 text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-2">{msg}</p>}

      {/* ─── Form ─── */}
      {editId && (
        <div className="bg-white border border-beige p-6 mb-6 space-y-6">
          <h2 className="text-sm font-medium text-anthrazit-dark">
            {editId === "new" ? "Neues Objekt" : "Objekt bearbeiten"}
          </h2>

          {/* Basisdaten */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "address", label: "Adresse *", placeholder: "Röpkestraße 51" },
              { key: "city",    label: "Stadt *",   placeholder: "40215 Düsseldorf" },
              { key: "type",    label: "Typ",       placeholder: "Eigentumswohnung" },
              { key: "status",  label: "Status",    placeholder: "Verfügbar" },
              { key: "price",   label: "Preis",     placeholder: "auf Anfrage" },
              { key: "area",    label: "Wohnfläche",placeholder: "82 m²" },
              { key: "floor",   label: "Etage",     placeholder: "2. Obergeschoss" },
              { key: "yearBuilt",label:"Baujahr",   placeholder: "1975 (Kernsaniert 2019)" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={(form as Record<string, unknown>)[key] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Zimmer</label>
              <input
                type="number" min={1} max={20}
                value={form.rooms}
                onChange={(e) => setForm({ ...form, rooms: +e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Badezimmer</label>
              <input
                type="number" min={1} max={10}
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: +e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none"
              />
            </div>
          </div>

          {/* Beschreibung */}
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Objektbeschreibung</label>
            <textarea
              rows={6}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none resize-none"
              placeholder="Beschreiben Sie das Objekt…"
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Highlights</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                placeholder="z.B. Einbauküche inklusive"
                className="flex-1 border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="px-4 py-2 bg-anthrazit-dark text-white text-xs hover:bg-anthrazit transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-beige text-anthrazit text-xs px-3 py-1">
                  {h}
                  <button onClick={() => setForm((f) => ({ ...f, highlights: f.highlights.filter((_, j) => j !== i) }))}>
                    <X size={10} className="text-anthrazit-light hover:text-anthrazit" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Fotos */}
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">
              Fotos ({form.photos.length})
            </label>
            <label className="flex items-center gap-3 border-2 border-dashed border-beige hover:border-sand transition-colors cursor-pointer bg-[#f5f4f1] px-5 py-4 mb-3 w-full">
              <Upload size={16} className="text-sand" />
              <span className="text-sm text-anthrazit-light">
                {uploading ? "Wird hochgeladen…" : "Fotos auswählen (JPG, PNG, WebP)"}
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => e.target.files && uploadPhotos(e.target.files)}
                className="hidden"
              />
            </label>
            {form.photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {form.photos.map((src, i) => (
                  <div
                    key={src + i}
                    data-photo-idx={i}
                    onPointerDown={(e) => onPhotoPointerDown(i, e)}
                    style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    className={`relative group aspect-square border overflow-hidden transition-all select-none touch-none ${
                      dragging !== null ? "cursor-grabbing" : "cursor-grab"
                    } ${dragging === i ? "opacity-50 scale-95" : ""} ${
                      dragOver === i && dragging !== i ? "border-anthrazit ring-2 ring-anthrazit" : "border-beige"
                    }`}
                  >

                    {/* Grip-Icon */}
                    <div className="absolute top-1 right-1 z-10 bg-anthrazit-dark/60 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <GripVertical size={12} />
                    </div>

                    {/* Buttons: nur sichtbar wenn NICHT gerade gezogen wird */}
                    {dragging === null && (
                      <div className="absolute inset-0 z-10 bg-anthrazit-dark/0 group-hover:bg-anthrazit-dark/40 transition-colors flex items-end justify-center gap-1 pb-2 opacity-0 group-hover:opacity-100">
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => rotatePhoto(i)}
                          disabled={rotating === i}
                          className="p-1 bg-white/90 hover:bg-white text-anthrazit disabled:opacity-50"
                          title="90° drehen"
                        >
                          <RotateCw size={12} className={rotating === i ? "animate-spin" : ""} />
                        </button>
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => removePhoto(i)}
                          className="p-1 bg-white/90 hover:bg-white text-red-500"
                          title="Löschen"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}

                    {i === 0 && (
                      <span className="absolute top-1 left-1 z-10 bg-anthrazit-dark/70 text-white text-[9px] px-1.5 py-0.5 pointer-events-none">Titelbild</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-beige">
            <button
              onClick={save}
              disabled={saving || !form.address || !form.city}
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
                <button onClick={() => toggleActive(p)} className="p-1.5 text-anthrazit-light hover:text-anthrazit transition-colors">
                  {p.active ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => startEdit(p)} className="p-1.5 text-anthrazit-light hover:text-anthrazit transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => remove(p.id)} className="p-1.5 text-anthrazit-light hover:text-red-500 transition-colors">
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
