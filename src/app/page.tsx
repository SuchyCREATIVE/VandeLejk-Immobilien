import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "VandeLejk Immobilien – Immobilienmaklerin in Hilden",
  description:
    "Kauf, Verkauf & Vermietung von Immobilien in Hilden und Umgebung. Persönliche Beratung durch Vanessa Lejk – ehrlich, kompetent, verlässlich.",
  alternates: {
    canonical: "https://vandelejk-immobilien.de",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
