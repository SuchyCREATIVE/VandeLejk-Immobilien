import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <div className="pt-40 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl text-anthrazit-dark mb-4">Datenschutzerklärung</h1>
        <p className="text-sm text-anthrazit-light mb-10">
          Stand: [Monat Jahr] · Erstellt mit Unterstützung von e-recht24.de
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-anthrazit-light">

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">1. Datenschutz auf einen Blick</h2>
            <h3 className="font-[400] text-anthrazit mb-2">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was
              mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
              besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
              persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">2. Verantwortliche Stelle</h2>
            <p>
              VandeLejk Immobilien<br />
              Vanessa Lejk<br />
              Niedenstraße 113<br />
              40721 Hilden<br />
              E-Mail: [E-Mail-Adresse]
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">3. Datenerfassung auf dieser Website</h2>
            <h3 className="font-[400] text-anthrazit mb-2">Kontaktformular</h3>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre
              Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen
              Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von
              Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne
              Ihre Einwilligung weiter.
            </p>
            <p className="mt-3">
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1
              lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags
              zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen
              erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf
              unserem berechtigten Interesse an der effektiven Bearbeitung der an uns
              gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">4. Server-Log-Dateien</h2>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen
              in so genannten Server-Log-Dateien, die Ihr Browser automatisch
              übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes
              Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners,
              Uhrzeit der Serveranfrage, IP-Adresse.
            </p>
            <p className="mt-3">
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht
              vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von
              Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">5. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre
              gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger
              und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung
              oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema
              personenbezogene Daten können Sie sich jederzeit an uns wenden.
            </p>
            <p className="mt-3">
              Außerdem steht Ihnen ein Beschwerderecht bei der zuständigen
              Aufsichtsbehörde zu.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">6. Plugins und Tools</h2>
            <p>
              Diese Website verwendet keine Analyse-Tools von Drittanbietern (z. B.
              Google Analytics). Es werden keine Cookies für Tracking-Zwecke gesetzt.
            </p>
          </section>

          <div className="pt-6 border-t border-beige">
            <p className="text-xs text-anthrazit-light">
              Diese Datenschutzerklärung ist ein Platzhaltertext. Bitte ersetzen
              Sie diesen durch einen rechtskonformen, individualisierten Text –
              z. B. erstellt mit dem Generator von{" "}
              <a
                href="https://www.e-recht24.de"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-anthrazit transition-colors"
              >
                e-recht24.de
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
