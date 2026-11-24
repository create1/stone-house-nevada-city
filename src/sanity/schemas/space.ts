import { defineField, defineType } from "sanity";

export default defineType({
  name: "space",
  title: "Venue Space",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "object",
      fields: [
        defineField({ name: "seated", title: "Seated", type: "number" }),
        defineField({ name: "standing", title: "Standing", type: "number" }),
        defineField({ name: "ceremony", title: "Ceremony", type: "number" }),
        defineField({ name: "dinner", title: "Dinner", type: "number" }),
      ],
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "floor",
      title: "Floor",
      type: "string",
      options: { list: ["1st", "2nd", "outdoor"] },
    }),
    defineField({ name: "adaCompliant", title: "ADA Compliant", type: "boolean", initialValue: true }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  orderings: [{ title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "heroImage" },
  },
});
