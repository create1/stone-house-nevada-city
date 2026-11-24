import type { Space } from "@/data/spaces";

/**
 * JSON-LD structured data for SEO
 * Generates schema.org markup for the venue and its spaces
 */

export function getVenueJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "Stonehouse",
    description:
      "Historic event venue built in 1857 in Nevada City, California. Six unique spaces for weddings, corporate events, private dining, and live music.",
    url: "https://stonehouse.io",
    telephone: "+15302655050",
    email: "bookings@stonehouse.io",
    address: {
      "@type": "PostalAddress",
      streetAddress: "107 Sacramento St",
      addressLocality: "Nevada City",
      addressRegion: "CA",
      postalCode: "95959",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 39.2616,
      longitude: -121.0178,
    },
    maximumAttendeeCapacity: 300,
    publicAccess: true,
    isAccessibleForFree: false,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Full Bar Service", value: true },
      { "@type": "LocationFeatureSpecification", name: "Live Music Stage", value: true },
      { "@type": "LocationFeatureSpecification", name: "Outdoor Patio", value: true },
      { "@type": "LocationFeatureSpecification", name: "Catering Kitchen", value: true },
      { "@type": "LocationFeatureSpecification", name: "ADA Accessible (1st floor)", value: true },
      { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
    ],
    sameAs: [
      "https://instagram.com/stonehousenevadacity",
      "https://facebook.com/stonehousenevadacity",
      "https://www.pinterest.com/stonehousevenue/",
    ],
  };
}

export function getSpaceJsonLd(space: Space) {
  return {
    "@context": "https://schema.org",
    "@type": "MeetingRoom",
    name: `${space.name} — Stonehouse`,
    description: space.description,
    url: `https://stonehouse.io/venue/${space.slug}`,
    maximumAttendeeCapacity:
      space.capacity.standing ||
      space.capacity.seated ||
      space.capacity.ceremony ||
      space.capacity.dinner,
    amenityFeature: space.features.map((f) => ({
      "@type": "LocationFeatureSpecification",
      name: f,
      value: true,
    })),
    isAccessibleForFree: false,
    containedInPlace: {
      "@type": "EventVenue",
      name: "Stonehouse",
      url: "https://stonehouse.io",
    },
  };
}

export function getFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Stonehouse",
    image: "https://stonehouse.io/images/hero.jpg",
    url: "https://stonehouse.io",
    telephone: "+15302655050",
    email: "bookings@stonehouse.io",
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "107 Sacramento St",
      addressLocality: "Nevada City",
      addressRegion: "CA",
      postalCode: "95959",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 39.2616,
      longitude: -121.0178,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "10:00",
        closes: "00:00",
      },
    ],
  };
}
