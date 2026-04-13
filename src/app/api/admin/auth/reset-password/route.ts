import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: "Token und Passwort erforderlich." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Mindestens 8 Zeichen." }, { status: 400 });

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.used || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Der Link ist ungültig oder abgelaufen." }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: record.userId },
    data:  { passwordHash: hash, mustChangePassword: false },
  });
  await prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } });

  return NextResponse.json({ ok: true });
}
