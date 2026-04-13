const BASE_URL = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "https://vandelejk-immobilien.de";

function wrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VandeLejk Immobilien</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#a09b93;">
            VandeLejk Immobilien
          </p>
          <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#c4bdb4;">
            Vanessa Lejk
          </p>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;padding:48px 48px 40px;">
          <!-- Trennlinie oben -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
            <tr><td style="border-top:1px solid #e8e4de;"></td></tr>
          </table>

          ${content}

          <!-- Trennlinie unten -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
            <tr><td style="border-top:1px solid #e8e4de;"></td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:#c4bdb4;letter-spacing:0.1em;">
            VandeLejk Immobilien · Vanessa Lejk
          </p>
          <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:10px;color:#c4bdb4;">
            Diese E-Mail wurde automatisch generiert. Bitte nicht antworten.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(href: string, label: string) {
  return `<table cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
    <tr><td style="background:#3d4047;padding:0;">
      <a href="${href}" style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
        ${label}
      </a>
    </td></tr>
  </table>`;
}

function label(text: string) {
  return `<p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#a09b93;">${text}</p>`;
}

function value(text: string) {
  return `<p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;color:#3d4047;background:#f5f3ef;padding:10px 14px;">${text}</p>`;
}

// ─── Template: Einladung ──────────────────────────────────────────────────────
export function inviteEmail(opts: {
  username: string;
  email: string;
  tempPassword: string;
  role: string;
}) {
  const loginUrl = `${BASE_URL}/admin/login`;
  const roleLabel = opts.role === "admin" ? "Administrator" : "Redakteur";

  const content = `
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#3d4047;line-height:1.2;">
      Willkommen bei<br /><em style="font-style:italic;color:#6b6f78;">VandeLejk Immobilien</em>
    </h1>
    <p style="margin:16px 0 28px;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#6b6f78;">
      Ihr Konto wurde eingerichtet. Sie können sich ab sofort im Verwaltungsbereich anmelden.
      Bitte ändern Sie Ihr Passwort bei der ersten Anmeldung.
    </p>

    ${label("Benutzername")}
    ${value(opts.username)}

    ${label("E-Mail-Adresse")}
    ${value(opts.email)}

    ${label("Temporäres Passwort")}
    ${value(opts.tempPassword)}

    ${label("Ihre Rolle")}
    ${value(roleLabel)}

    ${btn(loginUrl, "Jetzt anmelden &rarr;")}

    <p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#a09b93;line-height:1.6;">
      Sie werden nach der ersten Anmeldung aufgefordert, ein eigenes Passwort zu setzen.
      Sollten Sie Fragen haben, wenden Sie sich bitte an Ihren Administrator.
    </p>`;

  return wrapper(content);
}

// ─── Template: Passwort zurücksetzen ─────────────────────────────────────────
export function resetPasswordEmail(opts: { username: string; resetUrl: string }) {
  const content = `
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#3d4047;line-height:1.2;">
      Passwort<br /><em style="font-style:italic;color:#6b6f78;">zurücksetzen</em>
    </h1>
    <p style="margin:16px 0 28px;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#6b6f78;">
      Hallo <strong>${opts.username}</strong>,<br /><br />
      wir haben eine Anfrage erhalten, das Passwort für Ihr Konto zurückzusetzen.
      Klicken Sie auf den folgenden Button, um ein neues Passwort festzulegen.
    </p>

    ${btn(opts.resetUrl, "Passwort festlegen &rarr;")}

    <p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#a09b93;line-height:1.6;">
      Dieser Link ist <strong>2 Stunden</strong> gültig.<br />
      Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren –
      Ihr Passwort bleibt unverändert.
    </p>`;

  return wrapper(content);
}
