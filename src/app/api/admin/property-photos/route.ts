import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const form = await req.formData();
  const files = form.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "Keine Dateien" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "properties");
  await mkdir(uploadDir, { recursive: true });

  const paths: string[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();

    const optimized = await sharp(Buffer.from(bytes))
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const dest = path.join(uploadDir, name);
    await writeFile(dest, optimized);
    paths.push(`/api/uploads/properties/${name}`);
  }

  return NextResponse.json({ paths });
}
