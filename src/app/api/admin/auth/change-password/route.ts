import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const { currentPassword, newPassword } = await req.json();
  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Mindestens 8 Zeichen." }, { status: 400 });
  }

  const userId = (session!.user as { id?: string }).id!;
  const user   = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Benutzer nicht gefunden." }, { status: 404 });

  // Bei Erstanmeldung (mustChangePassword) kein altes Passwort prüfen
  if (!user.mustChangePassword && currentPassword) {
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Aktuelles Passwort falsch." }, { status: 400 });
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data:  { passwordHash: hash, mustChangePassword: false },
  });

  return NextResponse.json({ ok: true });
}
