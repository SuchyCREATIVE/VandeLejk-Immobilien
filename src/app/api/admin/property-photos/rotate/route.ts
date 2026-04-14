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

  // Pfad kann /uploads/... oder /api/uploads/... sein
  const normalizedPath = cleanPath.startsWith("/api/uploads/")
    ? cleanPath.replace("/api/uploads/", "/uploads/")
    : cleanPath;

  const diskPath = path.join(process.cwd(), "public", normalizedPath);
  if (!diskPath.startsWith(path.join(process.cwd(), "public"))) {
    return NextResponse.json({ error: "Ungültiger Pfad" }, { status: 400 });
  }

  const ext  = path.extname(normalizedPath);
  const base = path.basename(normalizedPath, ext);
  const dir  = path.dirname(normalizedPath);
  const newName     = `${base}-r${Date.now()}${ext}`;
  const newDiskPath = path.join(process.cwd(), "public", dir, newName);
  const newWebPath  = `/api/uploads/${dir.replace(/^\/?uploads\//, "")}/${newName}`;

  await sharp(diskPath).rotate(90).toFile(newDiskPath);

  // Alte Datei löschen (nur wenn es keine Seed-Datei ist)
  try { await unlink(diskPath); } catch { /* ignorieren */ }

  return NextResponse.json({ newPath: newWebPath });
}
