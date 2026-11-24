/**
 * Sanity Content Seed Script
 *
 * Populates the Sanity dataset with all Stonehouse content:
 * spaces, event types, testimonials, FAQs, packages, site settings
 *
 * Usage:
 *   npx sanity exec scripts/seed-sanity.ts --with-user-token
 *
 * Or with environment variables:
 *   SANITY_PROJECT_ID=xxx SANITY_DATASET=production npx tsx scripts/seed-sanity.ts
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN || "",
  useCdn: false,
});

// ── Spaces ────────────────────────────────────
const spaces = [
  {
    _type: "space",
    _id: "space-music-venue",
    name: "Music Venue",
    slug: { _type: "slug", current: "music-venue" },
    tagline: "Where history meets sound",
    description:
      "Our flagship performance space features state-of-the-art sound within the original 1857 stone walls. A wooden dance floor and intimate layout create an unforgettable atmosphere for live music, receptions, and celebrations.",
    capacity: { seated: 50, standing: 300 },
    features: [
      "State-of-the-art sound system",
      "Wooden dance floor",
      "Original 1857 stone walls",
      "Professional lighting rig",
      "Backstage green room",
      "Full bar service",
    ],
    floor: "1st",
    adaCompliant: true,
    order: 1,
  },
  {
    _type: "space",
    _id: "space-tavern",
    name: "Tavern",
    slug: { _type: "slug", current: "tavern" },
    tagline: "Craft cocktails in a storied setting",
    description:
      "The Tavern's historic bar is the heart of Stonehouse. With room for 100 standing guests, it's the perfect spot for cocktail hours, casual receptions, and social gatherings surrounded by Gold Rush–era character.",
    capacity: { standing: 100 },
    features: [
      "Historic bar",
      "Craft cocktail program",
      "Original woodwork",
      "Ambient lighting",
      "Full bar service",
    ],
    floor: "1st",
    adaCompliant: true,
    order: 2,
  },
  {
    _type: "space",
    _id: "space-dining-room",
    name: "Dining Room",
    slug: { _type: "slug", current: "dining-room" },
    tagline: "Elegance carved in stone",
    description:
      "Exposed stone walls and original timber beams set the stage for seated dinners and formal occasions. The Dining Room accommodates up to 90 seated guests on the second floor and can combine with the Lounge for larger parties of 140.",
    capacity: { seated: 90, standing: 117 },
    features: [
      "Exposed stone walls",
      "Original timber beams",
      "Seated dinner configuration",
      "Combines with Lounge for 140 guests",
      "Private bar access",
    ],
    notes: ["2nd floor — not ADA compliant"],
    floor: "2nd",
    adaCompliant: false,
    order: 3,
  },
  {
    _type: "space",
    _id: "space-lounge",
    name: "Lounge",
    slug: { _type: "slug", current: "lounge" },
    tagline: "Intimate luxury, elevated",
    description:
      "Plush leather seating and craft cocktails define the Lounge experience. Ideal for intimate gatherings of up to 50 seated guests, or open the adjoining wall to combine with the Dining Room for events up to 140.",
    capacity: { seated: 50, standing: 65 },
    features: [
      "Plush leather seating",
      "Craft cocktail service",
      "Intimate atmosphere",
      "Combines with Dining Room for 140 guests",
      "Private bar",
    ],
    notes: ["2nd floor — not ADA compliant"],
    floor: "2nd",
    adaCompliant: false,
    order: 4,
  },
  {
    _type: "space",
    _id: "space-wine-cavern",
    name: "Wine Cavern",
    slug: { _type: "slug", current: "wine-cavern" },
    tagline: "A hidden gem beneath the surface",
    description:
      "Descend into the original 1800s stone cave for an experience unlike any other. The Wine Cavern seats up to 30 guests in a naturally climate-controlled underground space — perfect for wine dinners, tastings, and intimate celebrations.",
    capacity: { seated: 30, standing: 39 },
    features: [
      "Original 1800s stone cave",
      "Naturally climate-controlled",
      "Curated wine selection",
      "Intimate candlelit ambiance",
      "Wine tasting experiences",
    ],
    floor: "1st",
    adaCompliant: true,
    order: 5,
  },
  {
    _type: "space",
    _id: "space-patio",
    name: "Patio",
    slug: { _type: "slug", current: "patio" },
    tagline: "Under the pines, between the stones",
    description:
      "Surrounded by original stone walls and towering pine trees, the Patio offers a stunning outdoor setting for ceremonies, dinners, and celebrations. Accommodates up to 130 for ceremonies or 100 for seated dinners.",
    capacity: { dinner: 100, ceremony: 130 },
    features: [
      "Outdoor stone courtyard",
      "Towering pine trees",
      "Original stone walls",
      "String light canopy",
      "Ceremony and reception configurations",
      "Covered areas available",
    ],
    notes: ["10 PM music curfew"],
    floor: "outdoor",
    adaCompliant: true,
    order: 6,
  },
];

// ── Event Types ───────────────────────────────
const eventTypes = [
  {
    _type: "eventType",
    _id: "event-weddings",
    name: "Weddings",
    slug: { _type: "slug", current: "weddings" },
    tagline: "Your love story, written in stone",
    description:
      "Stonehouse offers a one-of-a-kind wedding experience within walls that have witnessed over 165 years of celebration. From intimate elopements in the Wine Cavern to grand receptions across the full building, every detail is steeped in history and elegance.",
    highlights: [
      "Ceremony and reception in one location",
      "Outdoor Patio ceremonies for up to 130 guests",
      "Full building buyout with Day-Of Coordinator",
      "Craft cocktail and wine programs",
      "Preferred vendor relationships",
      "Customizable floor plans and configurations",
    ],
    recommendedSpaces: [
      { _type: "reference", _ref: "space-patio" },
      { _type: "reference", _ref: "space-music-venue" },
      { _type: "reference", _ref: "space-dining-room" },
      { _type: "reference", _ref: "space-wine-cavern" },
    ],
    cta: "Start Planning Your Wedding",
    order: 1,
  },
  {
    _type: "eventType",
    _id: "event-corporate",
    name: "Corporate Events",
    slug: { _type: "slug", current: "corporate" },
    tagline: "Business, elevated",
    description:
      "Break away from the boardroom. Stonehouse provides a distinctive backdrop for corporate retreats, team celebrations, product launches, and client entertainment.",
    highlights: [
      "Flexible space configurations",
      "A/V and presentation capabilities",
      "Craft catering and cocktail programs",
      "Team building and retreat packages",
      "Private bar and dining options",
      "Walkable downtown Nevada City location",
    ],
    recommendedSpaces: [
      { _type: "reference", _ref: "space-dining-room" },
      { _type: "reference", _ref: "space-lounge" },
      { _type: "reference", _ref: "space-tavern" },
      { _type: "reference", _ref: "space-patio" },
    ],
    cta: "Plan Your Corporate Event",
    order: 2,
  },
  {
    _type: "eventType",
    _id: "event-private-dining",
    name: "Private Dining",
    slug: { _type: "slug", current: "private-dining" },
    tagline: "An unforgettable table",
    description:
      "Whether it's an intimate dinner for 10 in the Wine Cavern or a seated affair for 90 in the Dining Room, Stonehouse transforms every meal into an occasion.",
    highlights: [
      "Wine Cavern dinners for up to 30",
      "Dining Room for up to 90 seated",
      "Curated wine pairings",
      "Multi-course tasting menus available",
      "Private chef experiences",
      "Holiday and seasonal dining events",
    ],
    recommendedSpaces: [
      { _type: "reference", _ref: "space-wine-cavern" },
      { _type: "reference", _ref: "space-dining-room" },
      { _type: "reference", _ref: "space-lounge" },
      { _type: "reference", _ref: "space-patio" },
    ],
    cta: "Reserve Your Private Dinner",
    order: 3,
  },
  {
    _type: "eventType",
    _id: "event-live-music",
    name: "Live Music",
    slug: { _type: "slug", current: "live-music" },
    tagline: "Sound that moves through stone",
    description:
      "The Music Venue at Stonehouse is Nevada City's premier live performance space. With state-of-the-art sound, a wooden dance floor, and walls that have hosted performers for over a century.",
    highlights: [
      "State-of-the-art sound system",
      "300-person standing capacity",
      "Wooden dance floor",
      "Professional lighting rig",
      "Backstage green room",
      "Full bar and craft cocktails",
    ],
    recommendedSpaces: [
      { _type: "reference", _ref: "space-music-venue" },
      { _type: "reference", _ref: "space-tavern" },
    ],
    cta: "Book a Show",
    order: 4,
  },
  {
    _type: "eventType",
    _id: "event-fundraisers",
    name: "Fundraisers",
    slug: { _type: "slug", current: "fundraisers" },
    tagline: "Raise the bar. Raise the cause.",
    description:
      "Stonehouse is proud to support the Nevada City community and beyond. Our spaces lend gravitas and warmth to fundraising galas, charity auctions, and benefit concerts.",
    highlights: [
      "Full building for large-scale galas",
      "Live music and entertainment capabilities",
      "Silent and live auction spaces",
      "Cocktail reception configurations",
      "Community-focused partnerships",
      "Customizable event packages",
    ],
    recommendedSpaces: [
      { _type: "reference", _ref: "space-music-venue" },
      { _type: "reference", _ref: "space-tavern" },
      { _type: "reference", _ref: "space-dining-room" },
      { _type: "reference", _ref: "space-patio" },
    ],
    cta: "Plan Your Fundraiser",
    order: 5,
  },
  {
    _type: "eventType",
    _id: "event-holiday-parties",
    name: "Holiday Parties",
    slug: { _type: "slug", current: "holiday-parties" },
    tagline: "Celebrate the season in style",
    description:
      "There's no more magical setting for a holiday celebration than Stonehouse. The historic stone walls and warm lighting create a naturally festive atmosphere.",
    highlights: [
      "Festive historic ambiance",
      "Holiday cocktail and menu options",
      "Full building or individual space rentals",
      "Downtown Nevada City holiday charm",
      "Live music and entertainment options",
      "Customizable décor and theming",
    ],
    recommendedSpaces: [
      { _type: "reference", _ref: "space-music-venue" },
      { _type: "reference", _ref: "space-dining-room" },
      { _type: "reference", _ref: "space-tavern" },
      { _type: "reference", _ref: "space-lounge" },
    ],
    cta: "Book Your Holiday Party",
    order: 6,
  },
];

// ── Testimonials ──────────────────────────────
const testimonials = [
  {
    _type: "testimonial",
    _id: "testimonial-1",
    name: "Sarah & Michael",
    eventType: "Wedding",
    eventDate: "October 2024",
    quote:
      "Stonehouse made our wedding absolutely magical. The Wine Cavern cocktail hour and Patio ceremony were everything we dreamed of — our guests are still talking about it months later.",
    rating: 5,
    featured: true,
    order: 1,
  },
  {
    _type: "testimonial",
    _id: "testimonial-2",
    name: "Jessica Torres",
    eventType: "Corporate Retreat",
    eventDate: "March 2024",
    quote:
      "We booked Stonehouse for our annual company retreat and it exceeded every expectation. The Dining Room was perfect for our presentations and the Tavern kept the team socializing well into the evening.",
    rating: 5,
    featured: true,
    order: 2,
  },
  {
    _type: "testimonial",
    _id: "testimonial-3",
    name: "David Chen",
    eventType: "Annual Fundraiser",
    eventDate: "November 2024",
    quote:
      "The history and character of this building is unmatched. From the stone walls to the incredible staff, every detail of our fundraising gala felt elevated. We raised 40% more than our goal.",
    rating: 5,
    featured: true,
    order: 3,
  },
];

// ── Site Settings ─────────────────────────────
const siteSettings = {
  _type: "siteSettings",
  _id: "siteSettings",
  siteName: "Stonehouse",
  tagline: "Est. 1857 · Nevada City, California",
  description:
    "Built in 1857, Stonehouse is a premier event venue in Nevada City, California. Six unique spaces for weddings, corporate events, private dining, and live music.",
  heroHeadline: "Where Historic Nevada City Meets Modern Celebration",
  heroSubheadline:
    "10,000 square feet of character. Six unique spaces. One unforgettable venue built during the California Gold Rush.",
  socialProof: [
    { _key: "sp1", label: "$70K booked", value: "in the first 3 weeks" },
  ],
  contact: {
    phone: "(530) 265-5050",
    email: "bookings@stonehouse.io",
    address: "107 Sacramento St\nNevada City, CA 95959",
    instagram: "https://instagram.com/stonehousenevadacity",
    facebook: "https://facebook.com/stonehousenevadacity",
  },
  openHouse: {
    enabled: true,
    date: "2026-06-14T17:00:00.000Z",
    title: "Summer Open House",
    description: "Tour all six spaces, meet our preferred vendors, and enjoy complimentary tastings.",
  },
};

// ── Seed Runner ───────────────────────────────
async function seed() {
  console.log("🏛️  Seeding Stonehouse content into Sanity...\n");

  const transaction = client.transaction();

  // Spaces
  console.log(`  → ${spaces.length} spaces`);
  for (const space of spaces) {
    transaction.createOrReplace(space);
  }

  // Event Types
  console.log(`  → ${eventTypes.length} event types`);
  for (const event of eventTypes) {
    transaction.createOrReplace(event);
  }

  // Testimonials
  console.log(`  → ${testimonials.length} testimonials`);
  for (const testimonial of testimonials) {
    transaction.createOrReplace(testimonial);
  }

  // Site Settings
  console.log(`  → Site settings`);
  transaction.createOrReplace(siteSettings);

  console.log("\n  Committing transaction...");
  const result = await transaction.commit();
  console.log(`\n✅ Done! ${result.results.length} documents created/updated.`);
  console.log(
    "\n  Next: Upload images via the Sanity Studio at https://stonehouse.sanity.studio",
  );
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
