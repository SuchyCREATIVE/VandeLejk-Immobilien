import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;

  if ((session!.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Nur Administratoren dürfen Benutzer bearbeiten." }, { status: 403 });
  }

  const { id } = await params;
  const { username, email, password, role } = await req.json();

  const data: Record<string, unknown> = { username, email, role };
  if (password) {
    data.passwordHash = await bcrypt.hash(password, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, username: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth();
  if (error) return error;

  if ((session!.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Nur Administratoren dürfen Benutzer löschen." }, { status: 403 });
  }

  const { id } = await params;
  const currentUserId = (session!.user as { id?: string }).id;

  if (id === currentUserId) {
    return NextResponse.json({ error: "Sie können sich nicht selbst löschen." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
