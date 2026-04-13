import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const maxOrder = await prisma.testimonial.aggregate({ _max: { sortOrder: true } });
  const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  const item = await prisma.testimonial.create({
    data: {
      name:      body.name,
      role:      body.role      ?? "",
      text:      body.text,
      rating:    body.rating    ?? 5,
      active:    body.active    ?? true,
      sortOrder: nextOrder,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
