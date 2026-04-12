import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

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
  name:     z.string().min(2).max(100),
  email:    z.string().email(),
  phone:    z.string().max(30).optional(),
  message:  z.string().min(10).max(3000),
  privacy:  z.literal(true),
  hp_field: z.string().max(0).optional(), // honeypot
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

  const { name, email, phone, message, hp_field } = parsed.data;

  // Honeypot check
  if (hp_field) {
    return NextResponse.json({ ok: true }); // silent reject
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
      html:    `<pre style="font-family:sans-serif;white-space:pre-wrap">${mailContent}</pre>`,
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
