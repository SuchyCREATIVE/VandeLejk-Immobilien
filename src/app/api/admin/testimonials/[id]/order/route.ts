import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const { dir } = await req.json();

  const all = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const targetIdx = dir === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= all.length) return NextResponse.json({ ok: true });

  await Promise.all([
    prisma.testimonial.update({ where: { id: all[idx].id },       data: { sortOrder: all[targetIdx].sortOrder } }),
    prisma.testimonial.update({ where: { id: all[targetIdx].id }, data: { sortOrder: all[idx].sortOrder } }),
  ]);

  return NextResponse.json({ ok: true });
}
