import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { resetPasswordEmail } from "@/lib/email-templates";
import crypto from "crypto";

const BASE_URL = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "https://vandelejk-immobilien.de";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "E-Mail fehlt." }, { status: 400 });

  // Immer OK zurückgeben (kein User-Enumeration)
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true });

  // Alte Tokens ungültig machen
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token     = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h

  await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt } });

  const resetUrl = `${BASE_URL}/admin/reset-passwort?token=${token}`;
  await sendMail({
    to:      user.email,
    subject: "Passwort zurücksetzen – VandeLejk Immobilien",
    html:    resetPasswordEmail({ username: user.username, resetUrl }),
  });

  return NextResponse.json({ ok: true });
}
