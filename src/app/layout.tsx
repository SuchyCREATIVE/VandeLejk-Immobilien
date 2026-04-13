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
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${playfair.variable} ${jost.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
