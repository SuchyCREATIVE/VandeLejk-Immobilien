import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <div className="pt-40 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl text-anthrazit-dark mb-10">Impressum</h1>

        <div className="space-y-8 text-sm leading-relaxed text-anthrazit-light">

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">Angaben gemäß § 5 TMG</h2>
            <p>
              VandeLejk Immobilien<br />
              Vanessa Lejk<br />
              Niedenstraße 113<br />
              40721 Hilden
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">Kontakt</h2>
            <p>
              Telefon: [Telefonnummer]<br />
              E-Mail: [E-Mail-Adresse]
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">Berufsbezeichnung</h2>
            <p>
              Immobilienmakler/in<br />
              (verliehen in der Bundesrepublik Deutschland)
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">Aufsichtsbehörde</h2>
            <p>
              [zuständige Behörde, z. B. Gewerbeamt Hilden]<br />
              [Adresse der Behörde]
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">Erlaubnis gemäß § 34c GewO</h2>
            <p>
              Die Erlaubnis zur gewerbsmäßigen Vermittlung von Verträgen über
              Grundstücke wurde erteilt durch:<br />
              [zuständige Behörde, Aktenzeichen]
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
              auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
              §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen oder
              nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren
              Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
              Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
              verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-anthrazit-dark mb-3">Urheberrecht</h2>
            <p>
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen
              Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
              Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
              jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          {/* SuchyCREATIVE Signatur */}
          <section className="pt-6 border-t border-beige">
            <p className="text-xs text-anthrazit-light mb-4">
              Webdesign &amp; Entwicklung:
            </p>
            <a
              href="https://suchycreative.de"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-anthrazit-dark w-fit"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://suchycreative.de/images/Logo/suchy-creative-logo-font-white.svg"
                alt="SuchyCREATIVE"
                className="h-9"
              />
              <div className="text-white">
                <div className="font-[500] text-sm">Webdesign · Mediengestaltung · Fotografie</div>
                <div className="text-white/50 text-xs mt-1">
                  Dennis Suchy · Lochnerweg 36 · 40724 Hilden<br />
                  Tel.: +49 (0) 2103 / 978 498 · info@suchycreative.de
                </div>
              </div>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
