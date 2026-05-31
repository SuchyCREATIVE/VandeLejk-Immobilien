// Gemeinsame FAQ-Quelle: wird sowohl im UI (AngebotClient) als auch im
// FAQPage-JSON-LD (angebot/page.tsx) verwendet – so bleibt beides synchron.
export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: "Was kostet mich der Verkauf über VandeLejk Immobilien?",
    a: "Sie gehen kein Risiko ein: Eine Provision fällt erst an, wenn Ihre Immobilie erfolgreich verkauft ist. Die genauen Konditionen besprechen wir transparent und unverbindlich in unserem persönlichen Erstgespräch.",
  },
  {
    q: "Wie ermitteln Sie den Wert meiner Immobilie?",
    a: "Ich bewerte Ihre Immobilie anhand von Lage, Zustand, Ausstattung und aktuellen Vergleichsverkäufen in der Region. Als Sachverständige für Immobilienwertermittlung erhalten Sie eine fundierte, realistische Einschätzung – keine geschönten Wunschpreise.",
  },
  {
    q: "In welchen Regionen sind Sie tätig?",
    a: "Mein Schwerpunkt liegt in Hilden, Düsseldorf und dem direkten Umland – darunter Ratingen, Langenfeld und Erkrath. Sprechen Sie mich gern an, auch wenn Ihre Immobilie etwas außerhalb liegt.",
  },
  {
    q: "Wie lange dauert es, eine Immobilie zu verkaufen?",
    a: "Das hängt von Objekt, Lage und Preis ab. Durch eine realistische Bewertung und gezielte Vermarktung lassen sich viele Immobilien innerhalb weniger Wochen bis Monate vermitteln. Im Erstgespräch gebe ich Ihnen eine ehrliche Einschätzung für Ihren Fall.",
  },
  {
    q: "Warum eine persönliche Maklerin statt eines großen Portals?",
    a: "Bei mir sind Sie keine Nummer. Sie haben durchgehend dieselbe Ansprechpartnerin, die Ihre Immobilie und die Region kennt, erreichbar ist und sich Zeit nimmt. Persönliche Betreuung statt anonymer Massenabwicklung.",
  },
];
