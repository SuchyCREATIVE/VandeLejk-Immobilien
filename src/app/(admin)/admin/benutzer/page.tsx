"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Shield, User, Mail, Key } from "lucide-react";

type UserRow = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "redakteur";
  mustChangePassword: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

type NewForm  = { username: string; email: string; role: "admin" | "redakteur" };
type EditForm = { username: string; email: string; password: string; role: "admin" | "redakteur" };

const EMPTY_NEW:  NewForm  = { username: "", email: "", role: "redakteur" };
const EMPTY_EDIT: EditForm = { username: "", email: "", password: "", role: "redakteur" };

export default function BenutzerAdmin() {
  const [users,   setUsers]   = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode,    setMode]    = useState<"new" | "edit" | null>(null);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [newForm, setNewForm] = useState<NewForm>(EMPTY_NEW);
  const [editForm,setEditForm]= useState<EditForm>(EMPTY_EDIT);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState<{ text: string; ok: boolean } | null>(null);

  async function load() {
    const r = await fetch("/api/admin/users");
    if (r.ok) setUsers(await r.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function startNew()    { setMode("new");  setNewForm(EMPTY_NEW);  setMsg(null); }
  function startEdit(u: UserRow) {
    setMode("edit");
    setEditId(u.id);
    setEditForm({ username: u.username, email: u.email, password: "", role: u.role });
    setMsg(null);
  }
  function cancel() { setMode(null); setEditId(null); setMsg(null); }

  async function saveNew() {
    setSaving(true); setMsg(null);
    const r = await fetch("/api/admin/users", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(newForm),
    });
    const data = await r.json();
    setSaving(false);
    if (r.ok) {
      await load();
      setMode(null);
      setMsg({
        text: data.emailSent
          ? `Benutzer angelegt. Einladungs-E-Mail wurde an ${newForm.email} gesendet.`
          : `Benutzer angelegt. Temporäres Passwort: ${data.tempPassword} (E-Mail konnte nicht gesendet werden – SMTP prüfen)`,
        ok: true,
      });
    } else {
      setMsg({ text: data.error ?? "Fehler.", ok: false });
    }
  }

  async function saveEdit() {
    setSaving(true); setMsg(null);
    const r = await fetch(`/api/admin/users/${editId}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(editForm),
    });
    const data = await r.json();
    setSaving(false);
    if (r.ok) { await load(); setMode(null); setMsg({ text: "Gespeichert.", ok: true }); }
    else setMsg({ text: data.error ?? "Fehler.", ok: false });
  }

  async function remove(u: UserRow) {
    if (!confirm(`Benutzer „${u.username}" wirklich löschen?`)) return;
    const r = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    const data = await r.json();
    if (r.ok) { await load(); setMsg({ text: "Benutzer gelöscht.", ok: true }); }
    else setMsg({ text: data.error ?? "Fehler.", ok: false });
  }

  if (loading) return <div className="p-10 text-sm text-anthrazit-light">Lädt…</div>;

  return (
    <div className="p-10 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-sand mb-1">Administration</p>
          <h1 className="text-2xl text-anthrazit-dark">Benutzerverwaltung</h1>
        </div>
        <button onClick={startNew}
          className="flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors">
          <Plus size={13} /> Einladen
        </button>
      </div>

      {msg && (
        <div className={`mb-4 text-xs px-3 py-3 border leading-relaxed ${msg.ok ? "text-green-700 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"}`}>
          {msg.text}
        </div>
      )}

      {/* ─── Neuer Benutzer (Einladung) ─── */}
      {mode === "new" && (
        <div className="bg-white border border-beige p-6 mb-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={15} className="text-sand" />
            <h2 className="text-sm font-medium text-anthrazit-dark">Benutzer per E-Mail einladen</h2>
          </div>
          <p className="text-xs text-anthrazit-light leading-relaxed">
            Ein temporäres Passwort wird automatisch generiert und per E-Mail zugestellt.
            Der Benutzer muss es bei der ersten Anmeldung ändern.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Benutzername *</label>
              <input type="text" value={newForm.username}
                onChange={(e) => setNewForm({ ...newForm, username: e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">E-Mail *</label>
              <input type="email" value={newForm.email}
                onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Rolle *</label>
            <select value={newForm.role}
              onChange={(e) => setNewForm({ ...newForm, role: e.target.value as "admin" | "redakteur" })}
              className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none bg-white">
              <option value="admin">Administrator</option>
              <option value="redakteur">Redakteur</option>
            </select>
          </div>

          <div className="bg-beige/50 p-3 text-xs text-anthrazit-light leading-relaxed">
            <strong className="text-anthrazit-dark">Administrator</strong> – voller Zugriff inkl. Benutzerverwaltung &amp; Einstellungen.<br />
            <strong className="text-anthrazit-dark">Redakteur</strong> – kann Kundenstimmen und Immobilien verwalten.
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-beige">
            <button onClick={saveNew}
              disabled={saving || !newForm.username || !newForm.email}
              className="flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-50">
              <Mail size={13} /> {saving ? "Wird gesendet…" : "Einladung senden"}
            </button>
            <button onClick={cancel}
              className="flex items-center gap-2 border border-beige px-5 py-2 text-[11px] tracking-[0.15em] uppercase text-anthrazit-light hover:border-anthrazit-light transition-colors">
              <X size={13} /> Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* ─── Benutzer bearbeiten ─── */}
      {mode === "edit" && (
        <div className="bg-white border border-beige p-6 mb-6 space-y-4">
          <h2 className="text-sm font-medium text-anthrazit-dark">Benutzer bearbeiten</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Benutzername *</label>
              <input type="text" value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">E-Mail *</label>
              <input type="email" value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">
                <Key size={10} className="inline mr-1" />Neues Passwort (leer = unverändert)
              </label>
              <input type="password" value={editForm.password} placeholder="Leer lassen = nicht ändern"
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-anthrazit-light mb-1.5">Rolle *</label>
              <select value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value as "admin" | "redakteur" })}
                className="w-full border border-beige px-3 py-2 text-sm text-anthrazit focus:border-anthrazit-light focus:outline-none bg-white">
                <option value="admin">Administrator</option>
                <option value="redakteur">Redakteur</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-beige">
            <button onClick={saveEdit}
              disabled={saving || !editForm.username || !editForm.email}
              className="flex items-center gap-2 bg-anthrazit-dark text-white px-5 py-2 text-[11px] tracking-[0.15em] uppercase hover:bg-anthrazit transition-colors disabled:opacity-50">
              <Check size={13} /> {saving ? "Speichert…" : "Speichern"}
            </button>
            <button onClick={cancel}
              className="flex items-center gap-2 border border-beige px-5 py-2 text-[11px] tracking-[0.15em] uppercase text-anthrazit-light hover:border-anthrazit-light transition-colors">
              <X size={13} /> Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* ─── Benutzerliste ─── */}
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="bg-white border border-beige p-5 flex items-center gap-4">
            <div className={`w-9 h-9 flex items-center justify-center shrink-0 ${u.role === "admin" ? "bg-anthrazit-dark" : "bg-beige"}`}>
              {u.role === "admin"
                ? <Shield size={15} className="text-white" />
                : <User   size={15} className="text-anthrazit-light" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-anthrazit-dark">{u.username}</p>
                {u.mustChangePassword && (
                  <span className="text-[9px] tracking-widest uppercase bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5">
                    Erstanmeldung ausstehend
                  </span>
                )}
              </div>
              <p className="text-xs text-anthrazit-light">{u.email}</p>
            </div>
            <span className={`text-[9px] tracking-widest uppercase px-2.5 py-1 shrink-0 ${
              u.role === "admin" ? "bg-anthrazit-dark text-white" : "bg-beige text-anthrazit-light"
            }`}>
              {u.role === "admin" ? "Administrator" : "Redakteur"}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => startEdit(u)} className="p-1.5 text-anthrazit-light hover:text-anthrazit transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(u)} className="p-1.5 text-anthrazit-light hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
