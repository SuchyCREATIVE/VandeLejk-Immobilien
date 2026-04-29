import type { Metadata } from "next";
import KontaktClient from "./KontaktClient";

export const metadata: Metadata = {
  title: "Kontakt – VandeLejk Immobilien Hilden",
  description:
    "Vereinbaren Sie ein persönliches Erstgespräch mit Vanessa Lejk. Persönliche Immobilienberatung in Hilden – jetzt Kontakt aufnehmen.",
  alternates: {
    canonical: "https://vandelejk-immobilien.de/kontakt",
  },
};

export default function KontaktPage() {
  return <KontaktClient />;
}
