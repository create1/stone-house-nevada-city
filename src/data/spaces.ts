export interface Space {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  capacity: {
    seated?: number;
    standing?: number;
    ceremony?: number;
    dinner?: number;
  };
  features: string[];
  notes?: string[];
  floor: "1st" | "2nd" | "outdoor";
  adaCompliant: boolean;
  image: string;
  gallery: string[];
}

// Order matches target site: Great Hall, Cavern, Penthouse, Courtyard, Showroom, Parlor
export const spaces: Space[] = [
  {
    slug: "music-venue",
    name: "The Great Hall",
    tagline: "Where history meets sound",
    description:
      "Our flagship performance space features state-of-the-art sound within the original 1857 stone walls. A wooden dance floor and intimate layout create an unforgettable atmosphere for live music, receptions, and celebrations.",
    capacity: {
      seated: 50,
      standing: 300,
    },
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
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/697e61f92beaf320fb3c45ea_thegreathall5.webp",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/697e61f92beaf320fb3c45ea_thegreathall5.webp",
    ],
  },
  {
    slug: "wine-cavern",
    name: "The Cavern",
    tagline: "A hidden gem beneath the surface",
    description:
      "Descend into the original 1800s stone cave for an experience unlike any other. The Wine Cavern seats up to 30 guests in a naturally climate-controlled underground space — perfect for wine dinners, tastings, and intimate celebrations.",
    capacity: {
      seated: 30,
      standing: 39,
    },
    features: [
      "Original 1800s stone cave",
      "Naturally climate-controlled",
      "Curated wine selection",
      "Intimate candlelit ambiance",
      "Wine tasting experiences",
    ],
    floor: "1st",
    adaCompliant: true,
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/678ed8ba7186bc93b18ebc73_A91A3219.avif",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/678ed8ba7186bc93b18ebc73_A91A3219.avif",
    ],
  },
  {
    slug: "dining-room",
    name: "The Penthouse",
    tagline: "Elegance carved in stone",
    description:
      "Exposed stone walls and original timber beams set the stage for seated dinners and formal occasions. The Dining Room accommodates up to 90 seated guests on the second floor and can combine with the Lounge for larger parties of 140.",
    capacity: {
      seated: 80,
      standing: 80,
    },
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
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/676f1d3fad7f4e1e69498074_DSC06116-Enhanced-NR.avif",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/676f1d3fad7f4e1e69498074_DSC06116-Enhanced-NR.avif",
    ],
  },
  {
    slug: "patio",
    name: "The Courtyard",
    tagline: "Open sky. Stone walls. Golden light.",
    description:
      "Surrounded by original stone walls and towering pine trees, the Patio offers a stunning outdoor setting for ceremonies, dinners, and celebrations. Accommodates up to 130 for ceremonies or 100 for seated dinners.",
    capacity: {
      dinner: 100,
      ceremony: 130,
    },
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
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/690e568a11efed90d02312f9_Wedding%20Venue%20Patio.jpg",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/690e568a11efed90d02312f9_Wedding%20Venue%20Patio.jpg",
    ],
  },
  {
    slug: "tavern",
    name: "The Showroom",
    tagline: "Light-filled. Flexible. Yours.",
    description:
      "The Tavern's historic bar is the heart of Stonehouse. With room for 100 standing guests, it's the perfect spot for cocktail hours, casual receptions, and social gatherings surrounded by Gold Rush–era character.",
    capacity: {
      standing: 100,
    },
    features: [
      "Historic bar",
      "Craft cocktail program",
      "Original woodwork",
      "Ambient lighting",
      "Full bar service",
    ],
    floor: "1st",
    adaCompliant: true,
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/676f1d4446c1224360c2eb95_DSC06359.avif",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/676f1d4446c1224360c2eb95_DSC06359.avif",
    ],
  },
  {
    slug: "lounge",
    name: "The Parlor",
    tagline: "Two bars. First toast to last dance.",
    description:
      "Plush leather seating and craft cocktails define the Lounge experience. Ideal for intimate gatherings of up to 50 seated guests, or open the adjoining wall to combine with the Dining Room for events up to 140.",
    capacity: {
      seated: 50,
      standing: 65,
    },
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
    image: "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/697e61fadb5d8151f8e2afa5_Nevada%20City%20WeddingsScreenshot%202023-12-26%20at%205.45.19%E2%80%AFAM.webp",
    gallery: [
      "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/697e61fadb5d8151f8e2afa5_Nevada%20City%20WeddingsScreenshot%202023-12-26%20at%205.45.19%E2%80%AFAM.webp",
    ],
  },
];

export const fullBuilding = {
  name: "Full Building",
  description:
    "Reserve all six spaces for your event and enjoy exclusive use of the entire Stonehouse property. Full building rentals include a Day-Of Coordinator to ensure everything runs seamlessly.",
  maxCapacity: 300,
  includes: [
    "All 6 unique spaces",
    "Day-Of Coordinator included",
    "Up to 300 guests",
    "Full bar service",
    "Dedicated event planning",
  ],
};

export function getSpaceBySlug(slug: string): Space | undefined {
  return spaces.find((s) => s.slug === slug);
}
