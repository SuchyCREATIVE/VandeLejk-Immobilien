"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Check, X, Upload, Plus, Trash2, RotateCw, ArrowLeft, GripVertical
} from "lucide-react";

type FormData = {
  address: string; city: string; type: string; status: string;
  price: string; area: string; rooms: number; bathrooms: number;
  floor: string; yearBuilt: string; description: string;
  highlights: string[]; photos: string[]; active: boolean;
};

const EMPTY: FormData = {
  address: "", city: "", type: "Eigentumswohnung", status: "Verfügbar",
  price: "auf Anfrage", area: "", rooms: 3, bathrooms: 1,
  floor: "", yearBuilt: "", description: "",
  highlights: [], photos: [], active: true,
};

export default function ImmobilieEditPage() {
  const router = useRouter();
  const { id }  = useParams<{ id: string }>();
  const isNew   = id === "neu";

  const [form, setForm]         = useState<FormData>(EMPTY);
  const [loading, setLoading]   = useState(!isNew);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rotating, setRotating] = useState<number | null>(null);
  const [msg, setMsg]           = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // ── DnD state ──────────────────────────────────────────────
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragIdx = useRef<number | null>(null);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/properties/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setForm({
          address: p.address, city: p.city, type: p.type, status: p.status,
          price: p.price, area: p.area, rooms: p.rooms, bathrooms: p.bathrooms,
          floor: p.floor, yearBuilt: p.yearBuilt, description: p.description,
          highlights: p.highlights, photos: p.photos, active: p.active,
        });
        setLoading(false);
      });
  }, [id, isNew]);

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const url    = isNew ? "/api/admin/properties" : `/api/admin/properties/${id}`;
      const method = isNew ? "POST" : "PUT";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        router.push("/admin/immobilien");
      } else {
        setMsg("Fehler beim Speichern.");
      }
    } finally {
      setSaving(false);
    }
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
    if (v) { setForm((f) => ({ ...f, highlights: [...f.highlights, v] })); setHighlightInput(""); }
  }

  // ── HTML5 DnD handlers (auf <div> mit background-image, kein <img>) ──
  function handleDragStart(idx: number) {
    dragIdx.current = idx;
    // State-Update verzögert damit Browser-Ghost korrekt gerendert wird
    setTimeout(() => setDragOver(idx), 0);
  }

  function handleDragOver(idx: number, e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(idx);
  }

  function handleDrop(idx: number, e: React.DragEvent) {
    e.preventDefault();
    const from = dragIdx.current;
    if (from !== null && from !== idx) {
      setForm((f) => {
        const photos = [...f.photos];
        const [moved] = photos.splice(from, 1);
        photos.splice(idx, 0, moved);
        return { ...f, photos };
      });
    }
    dragIdx.current = null;
    setDragOver(null);
  }

  function handleDragEnd() {
    dragIdx.current = null;
    setDragOver(null);
  }

  if (loading) return <div className="p-10 text-sm text-anthrazit-light">Lädt…</div>;

  return (
    <div className="p-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/admin/immobilien")}
          className="p-1.5 text-anthrazit-light hover:text-anthrazit transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-1">Administration · Immobilien</p>
          <h1 className="text-2xl text-anthrazit-dark">
            {isNew ? "Neues Objekt" : form.address || "Objekt bearbeiten"}
          </h1>
        </div>
      </div>

      {msg && <p className="mb-4 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2">{msg}</p>}

      <div className="space-y-6">
        {/* Basisdaten */}
        <div className="bg-white border border-beige p-6">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-sand mb-4">Basisdaten</h2>
          <div className="grid grid-cols-2 gap-4">
            {([
              { key: "address",  label: "Adresse *",   placeholder: "Röpkestraße 51" },
              { key: "city",     label: "Stadt *",      placeholder: "40215 Düsseldorf" },
              { key: "type",     label: "Typ",          placeholder: "Eigentumswohnung" },
              { key: "status",   label: "Status",       placeholder: "Verfügbar" },
              { key: "price",    label: "Preis",        placeholder: "auf Anfrage" },
              { key: "area",     label: "Wohnfläche",   placeholder: "82 m²" },
              { key: "floor",    label: "Etage / Art",  placeholder: "2. Obergeschoss" },
              { key: "yearBuilt",label: "Baujahr",      placeholder: "1975 (Kernsaniert 2019)" },
            ] as const).map(({ key, label, placeholder }) => (
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
              <input type="number" min={1} max={20} value={form.rooms}
                onChange={(e) => setForm({ ...form, rooms: +e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Badezimmer</label>
              <input type="number" min={1} max={10} value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: +e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Beschreibung */}
        <div className="bg-white border border-beige p-6">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-sand mb-4">Objektbeschreibung</h2>
          <textarea rows={7} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none resize-none"
            placeholder="Beschreiben Sie das Objekt…" />
        </div>

        {/* Highlights */}
        <div className="bg-white border border-beige p-6">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-sand mb-4">Highlights</h2>
          <div className="flex gap-2 mb-3">
            <input type="text" value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
              placeholder="z.B. Einbauküche inklusive"
              className="flex-1 border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none" />
            <button onClick={addHighlight}
              className="px-4 py-2 bg-anthrazit-dark text-white text-xs hover:bg-anthrazit transition-colors">
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
        <div className="bg-white border border-beige p-6">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-sand mb-4">
            Fotos ({form.photos.length}) – zum Umsortieren ziehen
          </h2>

          {/* Upload */}
          <label className="flex items-center gap-3 border-2 border-dashed border-beige hover:border-sand transition-colors cursor-pointer bg-[#f5f4f1] px-5 py-4 mb-4 w-full">
            <Upload size={16} className="text-sand flex-shrink-0" />
            <span className="text-sm text-anthrazit-light">
              {uploading ? "Wird hochgeladen…" : "Fotos auswählen (JPG, PNG, WebP)"}
            </span>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple
              onChange={(e) => e.target.files && uploadPhotos(e.target.files)} className="hidden" />
          </label>

          {/* Foto-Grid */}
          {form.photos.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {form.photos.map((src, i) => (
                <div
                  key={src + i}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(i, e)}
                  onDrop={(e) => handleDrop(i, e)}
                  onDragEnd={handleDragEnd}
                  style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className={`relative group aspect-square border cursor-grab select-none transition-all ${
                    dragOver === i && dragIdx.current !== i
                      ? "border-2 border-anthrazit scale-105"
                      : "border-beige"
                  }`}
                >
                  {/* Grip */}
                  <div className="absolute top-1 right-1 z-10 bg-black/50 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <GripVertical size={11} />
                  </div>

                  {/* Aktions-Buttons */}
                  <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center gap-1 pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); rotatePhoto(i); }}
                      disabled={rotating === i}
                      className="p-1.5 bg-white/90 hover:bg-white text-anthrazit disabled:opacity-50 shadow-sm"
                      title="90° drehen"
                    >
                      <RotateCw size={12} className={rotating === i ? "animate-spin" : ""} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                      className="p-1.5 bg-white/90 hover:bg-white text-red-500 shadow-sm"
                      title="Löschen"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {i === 0 && (
                    <span className="absolute top-1 left-1 z-10 bg-black/60 text-white text-[9px] px-1.5 py-0.5 pointer-events-none">
                      Titelbild
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sichtbarkeit */}
        <div className="bg-white border border-beige p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 border border-beige accent-anthrazit" />
            <span className="text-sm text-anthrazit">Objekt öffentlich sichtbar</span>
          </label>
        </div>

        {/* Speichern */}
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving || !form.address || !form.city}
            className="flex items-center gap-2 bg-anthrazit-dark text-white px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-50"
          >
            <Check size={13} /> {saving ? "Speichert…" : "Speichern"}
          </button>
          <button
            onClick={() => router.push("/admin/immobilien")}
            className="flex items-center gap-2 border border-beige px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase text-anthrazit-light hover:border-anthrazit-light transition-colors"
          >
            <X size={13} /> Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
