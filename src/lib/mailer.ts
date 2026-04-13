import nodemailer from "nodemailer";
import { prisma } from "./prisma";

async function getSmtpConfig() {
  const rows = await prisma.settings.findMany({
    where: { key: { in: ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from", "smtp_from_name"] } },
  });
  const cfg: Record<string, string> = {};
  for (const r of rows) cfg[r.key] = r.value;
  return cfg;
}

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  const cfg = await getSmtpConfig();

  if (!cfg.smtp_host || !cfg.smtp_user) {
    console.warn("SMTP nicht konfiguriert – E-Mail nicht gesendet:", opts.subject);
    return { ok: false, error: "SMTP nicht konfiguriert." };
  }

  const transporter = nodemailer.createTransport({
    host:   cfg.smtp_host,
    port:   parseInt(cfg.smtp_port ?? "587"),
    secure: parseInt(cfg.smtp_port ?? "587") === 465,
    auth:   { user: cfg.smtp_user, pass: cfg.smtp_pass ?? "" },
  });

  try {
    await transporter.sendMail({
      from:    `"${cfg.smtp_from_name ?? "VandeLejk Immobilien"}" <${cfg.smtp_from ?? cfg.smtp_user}>`,
      to:      opts.to,
      subject: opts.subject,
      html:    opts.html,
    });
    return { ok: true };
  } catch (err) {
    console.error("E-Mail-Fehler:", err);
    return { ok: false, error: String(err) };
  }
}
