import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: "immobilien_active" } });
    const active = setting ? JSON.parse(setting.value) : true;
    return NextResponse.json({ active });
  } catch {
    return NextResponse.json({ active: true });
  }
}
