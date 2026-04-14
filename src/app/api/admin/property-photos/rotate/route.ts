import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import path from "path";
import { unlink, mkdir } from "fs/promises";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { photoPath } = await req.json();
  if (!photoPath || typeof photoPath !== "string") {
    return NextResponse.json({ error: "Kein Pfad angegeben" }, { status: 400 });
  }

  const cleanPath = photoPath.split("?")[0];

  // Quellpfad auf Disk bestimmen
  const sourceDiskPath = cleanPath.startsWith("/api/uploads/")
    ? path.join(process.cwd(), "public", "uploads", cleanPath.replace("/api/uploads/", ""))
    : path.join(process.cwd(), "public", cleanPath);

  // Sicherheitscheck
  const publicRoot = path.join(process.cwd(), "public");
  if (!sourceDiskPath.startsWith(publicRoot)) {
    return NextResponse.json({ error: "Ungültiger Pfad" }, { status: 400 });
  }

  // Ziel immer in uploads/properties/ – unabhängig vom Quellpfad
  const uploadDir = path.join(process.cwd(), "public", "uploads", "properties");
  await mkdir(uploadDir, { recursive: true });

  const ext     = path.extname(cleanPath);
  const base    = path.basename(cleanPath, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const newName = `${base}-r${Date.now()}${ext}`;
  const newDiskPath = path.join(uploadDir, newName);
  const newWebPath  = `/api/uploads/properties/${newName}`;

  await sharp(sourceDiskPath).rotate(90).toFile(newDiskPath);

  // Nur löschen wenn es eine hochgeladene Datei ist (nicht Seed-Bilder)
  if (sourceDiskPath.includes(`${path.sep}uploads${path.sep}`)) {
    try { await unlink(sourceDiskPath); } catch { /* ignorieren */ }
  }

  return NextResponse.json({ newPath: newWebPath });
}
