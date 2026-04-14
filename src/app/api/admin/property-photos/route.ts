import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await file.arrayBuffer();
    const dest = path.join(uploadDir, name);
    await writeFile(dest, Buffer.from(bytes));
    paths.push(`/api/uploads/properties/${name}`);
  }

  return NextResponse.json({ paths });
}
