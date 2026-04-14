import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import path from "path";
import { unlink } from "fs/promises";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { photoPath } = await req.json();
  if (!photoPath || typeof photoPath !== "string") {
    return NextResponse.json({ error: "Kein Pfad angegeben" }, { status: 400 });
  }

  const cleanPath = photoPath.split("?")[0];
  const diskPath = path.join(process.cwd(), "public", cleanPath);
  if (!diskPath.startsWith(path.join(process.cwd(), "public"))) {
    return NextResponse.json({ error: "Ungültiger Pfad" }, { status: 400 });
  }

  // Neuen Dateinamen mit Timestamp generieren → Next.js Image-Cache wird umgangen
  const ext  = path.extname(cleanPath);
  const base = path.basename(cleanPath, ext);
  const dir  = path.dirname(cleanPath);
  const newName    = `${base}-r${Date.now()}${ext}`;
  const newWebPath = `${dir}/${newName}`;
  const newDiskPath = path.join(process.cwd(), "public", newWebPath);

  await sharp(diskPath).rotate(90).toFile(newDiskPath);

  // Alte Datei löschen (nur wenn es keine Seed-Datei ist)
  try { await unlink(diskPath); } catch { /* ignorieren */ }

  return NextResponse.json({ newPath: newWebPath });
}
