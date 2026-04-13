import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT = "/images/hero-building.jpg";

export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: "hero_image" } });
    return NextResponse.json({ value: setting?.value ?? DEFAULT });
  } catch {
    return NextResponse.json({ value: DEFAULT });
  }
}
