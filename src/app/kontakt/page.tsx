import type { Metadata } from "next";
import KontaktClient from "./KontaktClient";

export const metadata: Metadata = {
  title: "Kontakt – Immobilienmaklerin Hilden",
  description:
    "Sie möchten Ihre Immobilie verkaufen oder suchen Beratung in Hilden & Düsseldorf? Schreiben Sie mir – ich melde mich persönlich bei Ihnen.",
  alternates: {
    canonical: "https://vandelejk-immobilien.de/kontakt",
  },
};

export default function KontaktPage() {
  return <KontaktClient />;
}
