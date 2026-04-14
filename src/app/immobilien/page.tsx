import type { Metadata } from "next";
import ImmobilienClient from "./ImmobilienClient";

export const metadata: Metadata = {
  title: "Aktuelle Immobilienangebote in Hilden | VandeLejk",
  description:
    "Ausgewählte Eigentumswohnungen und Häuser in Hilden und Umgebung. Persönlich geprüft und professionell präsentiert.",
  alternates: {
    canonical: "https://vandelejk-immobilien.de/immobilien",
  },
};

export default function ImmobilienPage() {
  return <ImmobilienClient />;
}
