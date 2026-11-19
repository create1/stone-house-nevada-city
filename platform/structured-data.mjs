/**
 * Google event structured data. Offer prices are the fee-inclusive ticket prices.
 */
const STATUS = {
  published: "https://schema.org/EventScheduled",
  sold_out: "https://schema.org/EventScheduled",
  canceled: "https://schema.org/EventCancelled",
  completed: "https://schema.org/EventScheduled",
  draft: "https://schema.org/EventScheduled",
};

function dollars(cents) {
  return (cents / 100).toFixed(2);
}

export function eventStructuredData({ event, venue, tickets, pageUrl }) {
  const offers = (tickets ?? []).map((ticket) => ({
    "@type": "Offer",
    name: ticket.name,
    price: dollars(ticket.priceCents),
    priceCurrency: "USD",
    availability:
      event.status === "sold_out"
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    url: pageUrl,
    validFrom: ticket.saleStartsAt,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventStatus: STATUS[event.status] ?? STATUS.published,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: event.description,
    image: event.heroImageUrl ? [event.heroImageUrl] : undefined,
    url: pageUrl,
    organizer: {
      "@type": "Organization",
      name: "Stone House",
      url: "https://stonehouse.io",
    },
    performer: event.performers
      ? event.performers.split(",").map((name) => ({
          "@type": "PerformingGroup",
          name: name.trim(),
        }))
      : undefined,
    location: {
      "@type": "Place",
      name: venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: venue.address,
        addressLocality: "Nevada City",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    offers,
  };
}
