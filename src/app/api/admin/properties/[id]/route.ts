import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

function parse(p: { highlights: string; photos: string; [key: string]: unknown }) {
  return { ...p, highlights: JSON.parse(p.highlights) as string[], photos: JSON.parse(p.photos) as string[] };
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const item = await prisma.property.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json(parse(item));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  const item = await prisma.property.update({
    where: { id },
    data: {
      address:     body.address,
      city:        body.city,
      type:        body.type,
      status:      body.status,
      price:       body.price,
      area:        body.area        ?? "",
      rooms:       body.rooms,
      bathrooms:   body.bathrooms,
      floor:       body.floor       ?? "",
      yearBuilt:   body.yearBuilt   ?? "",
      description: body.description ?? "",
      highlights:  JSON.stringify(body.highlights ?? []),
      photos:      JSON.stringify(body.photos      ?? []),
      active:      body.active,
    },
  });
  return NextResponse.json(parse(item));
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  await prisma.property.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
