import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import path from "path";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { photoPath } = await req.json();
  if (!photoPath || typeof photoPath !== "string") {
    return NextResponse.json({ error: "Kein Pfad angegeben" }, { status: 400 });
  }

  // Nur Pfade innerhalb von /public erlauben (Sicherheit)
  const cleanPath = photoPath.split("?")[0]; // Cache-Buster entfernen
  const diskPath = path.join(process.cwd(), "public", cleanPath);
  if (!diskPath.startsWith(path.join(process.cwd(), "public"))) {
    return NextResponse.json({ error: "Ungültiger Pfad" }, { status: 400 });
  }

  await sharp(diskPath).rotate(90).toFile(diskPath + ".tmp");

  const { rename } = await import("fs/promises");
  await rename(diskPath + ".tmp", diskPath);

  return NextResponse.json({ ok: true });
}
