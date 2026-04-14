import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vandelejk-immobilien.de"
  ),
  title: {
    default: "VandeLejk Immobilien – Vanessa Lejk",
    template: "%s · VandeLejk Immobilien",
  },
  description:
    "Persönliche Immobilienberatung in Hilden und Umgebung. Kaufen, verkaufen, vermieten – mit Herz, Expertise und echtem Engagement.",
  openGraph: {
    siteName: "VandeLejk Immobilien",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VandeLejk Immobilien – Immobilienmaklerin Vanessa Lejk in Hilden",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "RealEstateAgent"],
  name: "VandeLejk Immobilien",
  description:
    "Persönliche Immobilienberatung in Hilden und Umgebung. Kaufen, verkaufen, vermieten – mit Herz, Expertise und echtem Engagement.",
  url: "https://vandelejk-immobilien.de",
  email: "kontakt@vandelejk-immobilien.de",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Niedenstraße 113",
    addressLocality: "Hilden",
    postalCode: "40721",
    addressCountry: "DE",
  },
  areaServed: ["Hilden", "Düsseldorf", "Ratingen", "Langenfeld", "Erkrath"],
  serviceType: "Immobilienmakler",
  employee: {
    "@type": "Person",
    name: "Vanessa Lejk",
    jobTitle: "Immobilienmaklerin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${playfair.variable} ${jost.variable} overflow-x-hidden`}
    >
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
