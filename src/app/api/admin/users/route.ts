import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { inviteEmail } from "@/lib/email-templates";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true, mustChangePassword: true, createdAt: true, lastLoginAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  if ((session!.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Nur Administratoren dürfen Benutzer anlegen." }, { status: 403 });
  }

  const { username, email, role } = await req.json();
  if (!username || !email) {
    return NextResponse.json({ error: "Benutzername und E-Mail sind erforderlich." }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
  if (existing) {
    return NextResponse.json({ error: "Benutzername oder E-Mail bereits vergeben." }, { status: 409 });
  }

  // Temporäres Passwort generieren
  const tempPassword = crypto.randomBytes(5).toString("hex").toUpperCase();
  const hash = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.user.create({
    data: { username, email, passwordHash: hash, role: role ?? "redakteur", mustChangePassword: true },
    select: { id: true, username: true, email: true, role: true, mustChangePassword: true, createdAt: true },
  });

  // Einladungs-E-Mail senden
  const mailResult = await sendMail({
    to:      email,
    subject: "Ihre Einladung – VandeLejk Immobilien",
    html:    inviteEmail({ username, email, tempPassword, role: role ?? "redakteur" }),
  });

  return NextResponse.json({ ...user, emailSent: mailResult.ok, tempPassword }, { status: 201 });
}
