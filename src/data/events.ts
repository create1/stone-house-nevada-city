export interface EventType {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  recommendedSpaces: string[];
  image: string;
  gallery: string[];
  cta: string;
}

export const eventTypes: EventType[] = [
  {
    slug: "weddings",
    name: "Weddings",
    tagline: "Your love story, written in stone",
    description:
      "Stonehouse offers a one-of-a-kind wedding experience within walls that have witnessed over 165 years of celebration. From intimate elopements in the Wine Cavern to grand receptions across the full building, every detail is steeped in history and elegance. Our Patio provides a breathtaking ceremony backdrop under towering pines, while the Music Venue and Tavern keep the celebration going late into the night.",
    highlights: [
      "Ceremony and reception in one location",
      "Outdoor Patio ceremonies for up to 130 guests",
      "Full building buyout with Day-Of Coordinator",
      "Craft cocktail and wine programs",
      "Preferred vendor relationships",
      "Customizable floor plans and configurations",
    ],
    recommendedSpaces: [
      "patio",
      "music-venue",
      "dining-room",
      "wine-cavern",
    ],
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/68950a62c9bcf227c2629194_Sophie%2BNic-7983.webp",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/68950a62c9bcf227c2629194_Sophie%2BNic-7983.webp",
    ],
    cta: "Start Planning Your Wedding",
  },
  {
    slug: "corporate",
    name: "Corporate Events",
    tagline: "Business, elevated",
    description:
      "Break away from the boardroom. Stonehouse provides a distinctive backdrop for corporate retreats, team celebrations, product launches, and client entertainment. Our versatile spaces adapt from formal presentations to relaxed networking, all with the warmth and character that only a 160-year-old Gold Rush–era building can offer.",
    highlights: [
      "Flexible space configurations",
      "A/V and presentation capabilities",
      "Craft catering and cocktail programs",
      "Team building and retreat packages",
      "Private bar and dining options",
      "Walkable downtown Nevada City location",
    ],
    recommendedSpaces: ["dining-room", "lounge", "tavern", "patio"],
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/676f1d3fad7f4e1e69498074_DSC06116-Enhanced-NR.avif",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/676f1d3fad7f4e1e69498074_DSC06116-Enhanced-NR.avif",
    ],
    cta: "Plan Your Corporate Event",
  },
  {
    slug: "private-dining",
    name: "Private Dining",
    tagline: "An unforgettable table",
    description:
      "Whether it's an intimate dinner for 10 in the Wine Cavern or a seated affair for 90 in the Dining Room, Stonehouse transforms every meal into an occasion. Stone walls, timber beams, and candlelight set the scene, while our culinary partners craft menus worthy of the setting.",
    highlights: [
      "Wine Cavern dinners for up to 30",
      "Dining Room for up to 90 seated",
      "Curated wine pairings",
      "Multi-course tasting menus available",
      "Private chef experiences",
      "Holiday and seasonal dining events",
    ],
    recommendedSpaces: ["wine-cavern", "dining-room", "lounge", "patio"],
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/676f1d4446c1224360c2eb95_DSC06359.avif",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/676f1d4446c1224360c2eb95_DSC06359.avif",
    ],
    cta: "Reserve Your Private Dinner",
  },
  {
    slug: "live-music",
    name: "Live Music",
    tagline: "Sound that moves through stone",
    description:
      "The Music Venue at Stonehouse is Nevada City's premier live performance space. With state-of-the-art sound, a wooden dance floor, and walls that have hosted performers for over a century, this is where music comes alive. From national touring acts to local favorites, the intimate 300-person capacity creates a connection between artist and audience that larger venues simply can't match.",
    highlights: [
      "State-of-the-art sound system",
      "300-person standing capacity",
      "Wooden dance floor",
      "Professional lighting rig",
      "Backstage green room",
      "Full bar and craft cocktails",
    ],
    recommendedSpaces: ["music-venue", "tavern"],
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/697e61f92beaf320fb3c45ea_thegreathall5.webp",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/697e61f92beaf320fb3c45ea_thegreathall5.webp",
    ],
    cta: "Book a Show",
  },
  {
    slug: "fundraisers",
    name: "Fundraisers",
    tagline: "Raise the bar. Raise the cause.",
    description:
      "Stonehouse is proud to support the Nevada City community and beyond. Our spaces lend gravitas and warmth to fundraising galas, charity auctions, benefit concerts, and awareness events. The combination of historic ambiance and modern amenities creates an atmosphere where generosity flows as freely as the wine.",
    highlights: [
      "Full building for large-scale galas",
      "Live music and entertainment capabilities",
      "Silent and live auction spaces",
      "Cocktail reception configurations",
      "Community-focused partnerships",
      "Customizable event packages",
    ],
    recommendedSpaces: [
      "music-venue",
      "tavern",
      "dining-room",
      "patio",
    ],
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/678ed8ba7186bc93b18ebc73_A91A3219.avif",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/678ed8ba7186bc93b18ebc73_A91A3219.avif",
    ],
    cta: "Plan Your Fundraiser",
  },
  {
    slug: "holiday-parties",
    name: "Holiday Parties",
    tagline: "Celebrate the season in style",
    description:
      "There's no more magical setting for a holiday celebration than Stonehouse. The historic stone walls and warm lighting create a naturally festive atmosphere that pairs beautifully with the charm of downtown Nevada City during the holiday season. From company holiday parties to family gatherings, make this year's celebration one to remember.",
    highlights: [
      "Festive historic ambiance",
      "Holiday cocktail and menu options",
      "Full building or individual space rentals",
      "Downtown Nevada City holiday charm",
      "Live music and entertainment options",
      "Customizable décor and theming",
    ],
    recommendedSpaces: [
      "music-venue",
      "dining-room",
      "tavern",
      "lounge",
    ],
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/690e568a11efed90d02312f9_Wedding%20Venue%20Patio.jpg",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/690e568a11efed90d02312f9_Wedding%20Venue%20Patio.jpg",
    ],
    cta: "Book Your Holiday Party",
  },
  {
    slug: "celebrations",
    name: "Celebrations",
    tagline: "Every milestone deserves a great room",
    description:
      "Birthdays, anniversaries, milestones — whatever you're celebrating, Stonehouse has a space that fits. From an intimate champagne toast in the Wine Cavern to a full-building blowout with a live band, our six spaces adapt to every scale and style of celebration.",
    highlights: [
      "Six unique spaces for groups of 10 to 300",
      "Full bar and craft cocktail programs",
      "Customizable catering menus",
      "Live music and DJ capabilities",
      "Private and semi-private configurations",
      "Downtown Nevada City walkability",
    ],
    recommendedSpaces: ["music-venue", "dining-room", "lounge", "patio"],
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/697e61fadb5d8151f8e2afa5_Nevada%20City%20WeddingsScreenshot%202023-12-26%20at%205.45.19%E2%80%AFAM.webp",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/697e61fadb5d8151f8e2afa5_Nevada%20City%20WeddingsScreenshot%202023-12-26%20at%205.45.19%E2%80%AFAM.webp",
    ],
    cta: "Plan Your Celebration",
  },
  {
    slug: "memorials",
    name: "Memorials",
    tagline: "A beautiful space to honor a beautiful life",
    description:
      "Stone House provides a warm, dignified setting for celebrations of life and memorial gatherings. Our team offers compassionate support throughout the planning process, ensuring every detail reflects the spirit of your loved one. From intimate remembrances to larger gatherings, our spaces offer peace and beauty in equal measure.",
    highlights: [
      "Compassionate event planning support",
      "Indoor and outdoor ceremony spaces",
      "Flexible catering for receptions",
      "ADA accessible first floor spaces",
      "Private and peaceful atmosphere",
      "Customizable layouts and configurations",
    ],
    recommendedSpaces: ["dining-room", "patio", "wine-cavern", "lounge"],
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/6793f72050b2690b8c799686_DSC00429.avif",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/6793f72050b2690b8c799686_DSC00429.avif",
    ],
    cta: "Plan a Memorial",
  },
];

export function getEventBySlug(slug: string): EventType | undefined {
  return eventTypes.find((e) => e.slug === slug);
}
