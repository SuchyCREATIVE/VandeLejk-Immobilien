import type { Metadata } from "next";
import ImmobilienClient from "./ImmobilienClient";

export const metadata: Metadata = {
  title: "Verkaufte Immobilien & Referenzen",
  description:
    "Ein Einblick in bereits erfolgreich verkaufte Objekte – mit Stimmen meiner Eigentümer. Persönlich begleitet, sorgfältig vermarktet.",
  alternates: {
    canonical: "https://vandelejk-immobilien.de/erfolgsprojekte",
  },
};

export default function ImmobilienPage() {
  return <ImmobilienClient />;
}
