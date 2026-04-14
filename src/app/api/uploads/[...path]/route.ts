import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg",
  png: "image/png", webp: "image/webp", gif: "image/gif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await params;
  const filePath = path.join(UPLOAD_ROOT, ...parts);

  // Sicherheitscheck: nur innerhalb uploads erlaubt
  if (!filePath.startsWith(UPLOAD_ROOT)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const file = await readFile(filePath);
    const ext  = path.extname(filePath).slice(1).toLowerCase();
    const mime = MIME[ext] ?? "application/octet-stream";
    return new NextResponse(file, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
