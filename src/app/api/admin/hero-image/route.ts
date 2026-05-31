import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_WIDTH = 2400; // Hero ist Vollbild – etwas mehr Reserve
const WEBP_QUALITY = 80;

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const setting = await prisma.settings.findUnique({ where: { key: "hero_image" } });
  return NextResponse.json({ value: setting?.value ?? "/images/hero-building.webp" });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Keine Datei" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!["jpg", "jpeg", "png", "webp"].includes(ext ?? "")) {
    return NextResponse.json({ error: "Nur JPG, PNG oder WebP erlaubt" }, { status: 400 });
  }

  await mkdir(UPLOADS_DIR, { recursive: true });

  // Automatisch weboptimieren: rotieren (EXIF), auf max. Breite begrenzen, WebP.
  const optimized = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const fileName = `hero-${Date.now()}.webp`;
  await writeFile(path.join(UPLOADS_DIR, fileName), optimized);

  // Auslieferung über /api/uploads (Next serviert dynamisch hinzugefügte public-Dateien nicht).
  const imagePath = `/api/uploads/${fileName}`;
  await prisma.settings.upsert({
    where:  { key: "hero_image" },
    update: { value: imagePath },
    create: { key: "hero_image", value: imagePath },
  });

  return NextResponse.json({ value: imagePath });
}
