import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      description: "Used in browser title / sharing (when wired to the site).",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "contactEmail",
      title: "Primary booking email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
