import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

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

  const buffer = Buffer.from(await file.arrayBuffer());
  await mkdir(UPLOADS_DIR, { recursive: true });

  const fileName = `hero-${Date.now()}.${ext}`;
  await writeFile(path.join(UPLOADS_DIR, fileName), buffer);

  const imagePath = `/uploads/${fileName}`;
  await prisma.settings.upsert({
    where:  { key: "hero_image" },
    update: { value: imagePath },
    create: { key: "hero_image", value: imagePath },
  });

  return NextResponse.json({ value: imagePath });
}
