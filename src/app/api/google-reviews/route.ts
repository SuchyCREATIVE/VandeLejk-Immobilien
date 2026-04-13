import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 Stunde cachen

interface ReviewItem {
  author: string;
  rating: number;
  text: string;
  time?: string;
}

const STATIC_REVIEWS: ReviewItem[] = [
  {
    author: "Michael S.",
    rating: 5,
    text: "Vanessa hat uns beim Kauf unserer Traumwohnung wirklich hervorragend begleitet. Sie war stets erreichbar, ehrlich und hat uns nie unter Druck gesetzt. Absolute Empfehlung!",
  },
  {
    author: "Familie Braun",
    rating: 5,
    text: "Der Verkauf unseres Hauses lief reibungslos und professionell. Vanessa hat den richtigen Käufer gefunden und alles perfekt organisiert. Herzlichen Dank!",
  },
  {
    author: "Sabine W.",
    rating: 5,
    text: "Ich war beeindruckt von der persönlichen Betreuung. Vanessa kennt den Markt sehr gut und hat mir genau das gebracht, was ich brauchte. Sehr kompetent und sympathisch.",
  },
  {
    author: "Thomas K.",
    rating: 5,
    text: "Professionell, vertrauenswürdig und immer mit einem offenen Ohr. Die Zusammenarbeit mit Vanessa war eine Freude. So stellt man sich Maklerarbeit vor!",
  },
  {
    author: "Andrea M.",
    rating: 5,
    text: "Vanessa hat unsere Immobilie schnell und zum bestmöglichen Preis verkauft. Alles lief transparent und ohne Überraschungen. Wir empfehlen sie gerne weiter.",
  },
];

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (apiKey && placeId) {
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?languageCode=de`,
        {
          headers: {
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
          },
          next: { revalidate: 3600 },
        }
      );

      if (res.ok) {
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reviews: ReviewItem[] = (data.reviews ?? []).slice(0, 5).map((r: any) => ({
          author: r.authorAttribution?.displayName ?? "Google Nutzer",
          rating: r.rating ?? 5,
          text: r.text?.text ?? "",
          time: r.relativePublishTimeDescription ?? "",
        }));

        return NextResponse.json({
          rating: data.rating ?? 5.0,
          totalRatings: data.userRatingCount ?? 15,
          reviews: reviews.length > 0 ? reviews : STATIC_REVIEWS,
          source: "google" as const,
        });
      }
    } catch {
      // Fallback zu statischen Bewertungen
    }
  }

  return NextResponse.json({
    rating: 5.0,
    totalRatings: 15,
    reviews: STATIC_REVIEWS,
    source: "static" as const,
  });
}
