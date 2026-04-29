import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const items = await prisma.property.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(items.map(parse));
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const maxOrder = await prisma.property.aggregate({ _max: { sortOrder: true } });
  const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  const item = await prisma.property.create({
    data: {
      address:           body.address,
      city:              body.city,
      type:              body.type        ?? "Eigentumswohnung",
      status:            body.status      ?? "Verkauft",
      price:             body.price       ?? "auf Anfrage",
      area:              body.area        ?? "",
      rooms:             body.rooms       ?? 3,
      bathrooms:         body.bathrooms   ?? 1,
      floor:             body.floor       ?? "",
      yearBuilt:         body.yearBuilt   ?? "",
      description:       body.description ?? "",
      highlights:        JSON.stringify(body.highlights ?? []),
      photos:            JSON.stringify(body.photos      ?? []),
      testimonialQuote:  body.testimonialQuote  ?? "",
      testimonialAuthor: body.testimonialAuthor ?? "",
      active:            body.active      ?? true,
      sortOrder:         nextOrder,
    },
  });
  return NextResponse.json(parse(item), { status: 201 });
}

function parse(p: { highlights: string; photos: string; [key: string]: unknown }) {
  return {
    ...p,
    highlights: JSON.parse(p.highlights) as string[],
    photos:     JSON.parse(p.photos)     as string[],
  };
}
