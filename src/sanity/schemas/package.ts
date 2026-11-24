import { defineField, defineType } from "sanity";

export default defineType({
  name: "package",
  title: "Event Package",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Package Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["weddings", "corporate", "private"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
      options: { list: ["essential", "premium", "luxury"] },
    }),
    defineField({ name: "price", title: "Starting Price", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "includes",
      title: "Includes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "addOns",
      title: "Available Add-ons",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  preview: {
    select: { title: "name", subtitle: "category" },
  },
});
