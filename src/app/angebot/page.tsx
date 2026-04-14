import type { Metadata } from "next";
import AngebotClient from "./AngebotClient";

export const metadata: Metadata = {
  title: "Leistungen – Kauf, Verkauf & Vermietung | VandeLejk",
  description:
    "Von der Wertermittlung bis zum Notartermin: alle Immobilien-Leistungen von VandeLejk Immobilien auf einen Blick.",
  alternates: {
    canonical: "https://vandelejk-immobilien.de/angebot",
  },
};

export default function AngebotPage() {
  return <AngebotClient />;
}
