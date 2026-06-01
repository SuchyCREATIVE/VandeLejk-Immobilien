import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Öffentlicher Endpunkt: liefert NUR den Site-Key + Enabled-Status.
// Der Secret-Key wird hier bewusst NICHT herausgegeben (nur serverseitig in /api/contact).
export async function GET() {
  try {
    const rows = await prisma.settings.findMany({
      where: { key: { in: ["turnstile_enabled", "turnstile_site_key"] } },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const enabled = map.turnstile_enabled ? JSON.parse(map.turnstile_enabled) : false;
    const siteKey = map.turnstile_site_key ?? "";
    return NextResponse.json({ enabled: enabled && !!siteKey, siteKey });
  } catch {
    return NextResponse.json({ enabled: false, siteKey: "" });
  }
}
