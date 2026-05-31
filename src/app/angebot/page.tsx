import type { Metadata } from "next";
import AngebotClient from "./AngebotClient";
import { FAQS } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Kauf, Verkauf & Vermietung in Hilden",
  description:
    "Von der Wertermittlung bis zur Schlüsselübergabe: alle Leistungen rund um Kauf, Verkauf und Vermietung von Immobilien in Hilden, Düsseldorf und Umgebung.",
  alternates: {
    canonical: "https://vandelejk-immobilien.de/angebot",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AngebotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AngebotClient />
    </>
  );
}
