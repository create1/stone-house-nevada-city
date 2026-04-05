import { defineField, defineType } from "sanity";

export const sitePhoto = defineType({
  name: "sitePhoto",
  title: "Site photo",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "slug",
      description:
        "Stable id — must match the website (e.g. photo-hero). Run the migrate script or ask dev.",
      options: { maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lightboxCaption",
      title: "Lightbox caption",
      type: "string",
      description: "Shown in the full-screen image viewer when set.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      slug: "key.current",
      alt: "alt",
      media: "image",
    },
    prepare({ slug, alt, media }) {
      return {
        title: slug || "Photo",
        subtitle: alt,
        media,
      };
    },
  },
});
