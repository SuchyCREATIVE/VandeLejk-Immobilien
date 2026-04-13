import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const [testimonials, properties, activeProperties] = await Promise.all([
    prisma.testimonial.count(),
    prisma.property.count(),
    prisma.property.count({ where: { active: true } }),
  ]);

  return NextResponse.json({ testimonials, properties, activeProperties });
}
