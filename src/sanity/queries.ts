import { groq } from "next-sanity";

// ── Spaces ────────────────────────────────────
export const allSpacesQuery = groq`
  *[_type == "space"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    heroImage,
    gallery,
    capacity,
    features,
    notes,
    floor,
    adaCompliant
  }
`;

export const spaceBySlugQuery = groq`
  *[_type == "space" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    heroImage,
    gallery,
    capacity,
    features,
    notes,
    floor,
    adaCompliant
  }
`;

// ── Event Types ───────────────────────────────
export const allEventTypesQuery = groq`
  *[_type == "eventType"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    heroImage,
    gallery,
    highlights,
    recommendedSpaces[]->{ name, "slug": slug.current },
    cta,
    faqs
  }
`;

export const eventTypeBySlugQuery = groq`
  *[_type == "eventType" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    heroImage,
    gallery,
    highlights,
    recommendedSpaces[]->{ name, "slug": slug.current, heroImage, capacity },
    cta,
    faqs
  }
`;

// ── Testimonials ──────────────────────────────
export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(order asc) {
    _id,
    name,
    eventType,
    eventDate,
    quote,
    rating
  }
`;

export const allTestimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id,
    name,
    eventType,
    eventDate,
    quote,
    rating
  }
`;

// ── FAQs ──────────────────────────────────────
export const allFaqsQuery = groq`
  *[_type == "faq"] | order(category asc, order asc) {
    _id,
    question,
    answer,
    category
  }
`;

export const faqsByCategoryQuery = groq`
  *[_type == "faq" && category == $category] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`;

// ── Packages ──────────────────────────────────
export const packagesByCategoryQuery = groq`
  *[_type == "package" && category == $category] | order(order asc) {
    _id,
    name,
    category,
    tier,
    price,
    description,
    includes,
    addOns,
    featured
  }
`;

export const allPackagesQuery = groq`
  *[_type == "package"] | order(category asc, order asc) {
    _id,
    name,
    category,
    tier,
    price,
    description,
    includes,
    addOns,
    featured
  }
`;

// ── Blog Posts ─────────────────────────────────
export const allBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    category,
    tags,
    author,
    publishedAt
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    body,
    category,
    tags,
    author,
    publishedAt
  }
`;

// ── Site Settings ─────────────────────────────
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    description,
    heroHeadline,
    heroSubheadline,
    heroImage,
    heroVideo,
    socialProof,
    contact,
    openHouse
  }
`;
