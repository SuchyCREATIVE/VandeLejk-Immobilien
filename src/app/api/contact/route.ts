import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { contactNotificationEmail } from "@/lib/email-templates";

/* ─── Cloudflare Turnstile (optional, im Admin schaltbar) ──── */
async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const rows = await prisma.settings.findMany({
    where: { key: { in: ["turnstile_enabled", "turnstile_secret_key"] } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const enabled = map.turnstile_enabled ? JSON.parse(map.turnstile_enabled) : false;
  const secret = map.turnstile_secret_key ?? "";

  // Wenn nicht aktiviert oder kein Secret hinterlegt: kein Captcha-Zwang.
  if (!enabled || !secret) return true;
  if (!token) return false;

  try {
    const form = new URLSearchParams();
    form.append("secret", secret);
    form.append("response", token);
    if (ip && ip !== "unknown") form.append("remoteip", ip);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[contact] Turnstile verify error:", err);
    return false;
  }
}

/* ─── Simple in-memory rate limiter ──────────────────────── */
const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now    = Date.now();
  const window = 60_000; // 1 Minute
  const limit  = 5;

  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + window });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

/* ─── Validation ──────────────────────────────────────────── */
const schema = z.object({
  firstname: z.string().min(2).max(50),
  lastname:  z.string().min(2).max(50),
  email:     z.string().email(),
  phone:     z.string().min(6).max(30),
  message:   z.string().min(10).max(3000),
  privacy:   z.literal(true),
  hp_field:  z.string().max(0).optional(), // honeypot
  turnstileToken: z.string().optional(),   // Cloudflare Turnstile
});

/* ─── Handler ─────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
          ?? req.headers.get("x-real-ip")
          ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
      { status: 429 }
    );
  }

  // Parse & validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Bitte füllen Sie alle Pflichtfelder korrekt aus." },
      { status: 422 }
    );
  }

  const { firstname, lastname, email, phone, message, hp_field, turnstileToken } = parsed.data;
  const name = `${firstname} ${lastname}`;

  // Honeypot check
  if (hp_field) {
    return NextResponse.json({ ok: true }); // silent reject
  }

  // Cloudflare Turnstile (nur falls im Admin aktiviert)
  const captchaOk = await verifyTurnstile(turnstileToken, ip);
  if (!captchaOk) {
    return NextResponse.json(
      { message: "Bot-Schutz fehlgeschlagen. Bitte laden Sie die Seite neu und versuchen Sie es erneut." },
      { status: 403 }
    );
  }

  // Build transporter from env variables
  // (will be replaced with Settings-table lookup once admin is set up)
  const smtpHost = process.env.SMTP_HOST ?? "mail.scpreview.de";
  const smtpPort = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const smtpUser = process.env.SMTP_USER ?? "website@scpreview.de";
  const smtpPass = process.env.SMTP_PASS ?? "";
  const smtpFrom = process.env.SMTP_FROM ?? `noreply@vandelejk-immobilien.de`;
  const smtpTo   = process.env.SMTP_TO   ?? "info@vandelejk-immobilien.de";

  const transporter = nodemailer.createTransport({
    host:   smtpHost,
    port:   smtpPort,
    secure: smtpPort === 465,
    auth:   { user: smtpUser, pass: smtpPass },
  });

  const mailContent = `
Neue Kontaktanfrage von der Website

Name:     ${name}
E-Mail:   ${email}
Telefon:  ${phone ?? "–"}

Nachricht:
${message}

---
Gesendet über das Kontaktformular auf vandelejk-immobilien.de
  `.trim();

  try {
    await transporter.sendMail({
      from:    `"${name}" <${smtpFrom}>`,
      to:      smtpTo,
      replyTo: email,
      subject: `Kontaktanfrage von ${name}`,
      text:    mailContent,
      html:    contactNotificationEmail({ firstname, lastname, email, phone, message }),
    });
  } catch (err) {
    console.error("[contact] SMTP error:", err);
    return NextResponse.json(
      { message: "Die Nachricht konnte leider nicht gesendet werden. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
