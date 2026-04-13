import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const rows = await prisma.settings.findMany();
  const result: Record<string, unknown> = {};
  for (const row of rows) {
    try {
      result[row.key] = JSON.parse(row.value);
    } catch {
      result[row.key] = row.value;
    }
  }
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: "key fehlt" }, { status: 400 });

  const serialized = typeof value === "string" ? value : JSON.stringify(value);

  await prisma.settings.upsert({
    where:  { key },
    update: { value: serialized },
    create: { key, value: serialized },
  });

  return NextResponse.json({ ok: true });
}
