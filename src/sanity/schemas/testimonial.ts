import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Client Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "eventType", title: "Event Type", type: "string" }),
    defineField({ name: "eventDate", title: "Event Date", type: "string" }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "rating", title: "Rating (1-5)", type: "number", validation: (r) => r.min(1).max(5) }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  preview: {
    select: { title: "name", subtitle: "eventType" },
  },
});
