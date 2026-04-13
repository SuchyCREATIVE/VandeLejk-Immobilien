import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function GET() {
  const items = await prisma.property.findMany({
    where:   { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(
    items.map((p) => ({
      ...p,
      highlights: JSON.parse(p.highlights) as string[],
      photos:     JSON.parse(p.photos)     as string[],
    }))
  );
}
