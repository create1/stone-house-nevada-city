/**
 * Uploads legacy Webflow CDN images into Sanity and upserts sitePhoto docs.
 *
 * Env: SANITY_API_TOKEN (Editor) + SANITY_STUDIO_PROJECT_ID (or SANITY_PROJECT_ID)
 * Run from repo root: npm install && npm run migrate:photos
 */

import { createClient } from "@sanity/client";
import path from "path";

const CDN = "https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/";

const PHOTOS = [
  {
    key: "photo-sophie-nic",
    path: "68950a62c9bcf227c2629194_Sophie%2BNic-7983.webp",
    alt: "Wedding at Stone House Nevada City",
    lightboxCaption: "Sophie & Nicolas — Summer 2024",
  },
  {
    key: "photo-story-building",
    path: "6793f72050b2690b8c799686_DSC00429.avif",
    alt: "Stone House historic building Nevada City",
    lightboxCaption:
      "Stone House — 107 Sacramento Street, Nevada City, Est. 1857",
  },
  {
    key: "photo-great-hall",
    path: "697e61f92beaf320fb3c45ea_thegreathall5.webp",
    alt: "The Great Hall",
    lightboxCaption: "The Great Hall — up to 200 guests",
  },
  {
    key: "photo-cavern",
    path: "678ed8ba7186bc93b18ebc73_A91A3219.avif",
    alt: "The Cavern",
    lightboxCaption: "The Cavern — up to 40 guests",
  },
  {
    key: "photo-penthouse",
    path: "676f1d3fad7f4e1e69498074_DSC06116-Enhanced-NR.avif",
    alt: "The Penthouse",
    lightboxCaption: "The Penthouse — up to 80 guests",
  },
  {
    key: "photo-courtyard",
    path: "690e568a11efed90d02312f9_Wedding%20Venue%20Patio.jpg",
    alt: "The Courtyard",
    lightboxCaption: "The Courtyard — up to 150 guests",
  },
  {
    key: "photo-showroom",
    path: "676f1d4446c1224360c2eb95_DSC06359.avif",
    alt: "The Showroom",
    lightboxCaption: "The Showroom — up to 60 guests",
  },
  {
    key: "photo-parlor",
    path: "697e61fadb5d8151f8e2afa5_Nevada%20City%20WeddingsScreenshot%202023-12-26%20at%205.45.19%20PM.webp",
    alt: "The Parlor",
    lightboxCaption: "The Parlor — up to 30 guests",
  },
  {
    key: "photo-sarah-jordan",
    path: "697e61f963c8e4a1ebb0ffbe_S%26J-0026.webp",
    alt: "Wedding ceremony at Stone House Nevada City",
    lightboxCaption: "Sarah & Jordan — Fall 2024",
  },
  {
    key: "photo-steak",
    path: "67a4fe5ce9353387ba8e1420_steak.avif",
    alt: "Signature steak",
    lightboxCaption: "Stone House signature steak course",
  },
  {
    key: "photo-fish-flatlay",
    path: "67a4fe3e64dcdb217c319786_fishflatlay.avif",
    alt: "Fresh fish",
    lightboxCaption: "Stone House fresh fish course",
  },
  {
    key: "photo-wedding-dinner",
    path: "697e63f40eb87a09cf2edcf5_Wedding%20Shoot%207.webp",
    alt: "Reception dinner",
    lightboxCaption: "Wedding reception dinner at Stone House",
  },
];

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "Set SANITY_API_TOKEN and SANITY_STUDIO_PROJECT_ID (or SANITY_PROJECT_ID)."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function migrateOne(entry) {
  const url = CDN + entry.path;
  const ext = path.extname(entry.path.split("?")[0]) || ".bin";
  const filename = `${entry.key}${ext}`.replace(/[^a-z0-9._-]/gi, "_");

  console.log("→", entry.key);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const asset = await client.assets.upload("image", buf, { filename });

  const doc = {
    _id: `sitePhoto.${entry.key}`,
    _type: "sitePhoto",
    key: { _type: "slug", current: entry.key },
    alt: entry.alt,
    lightboxCaption: entry.lightboxCaption,
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    },
  };

  await client.createOrReplace(doc);
  console.log("  ✓", asset._id);
}

async function main() {
  for (const p of PHOTOS) {
    await migrateOne(p);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
