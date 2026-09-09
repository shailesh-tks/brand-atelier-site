import type { SchemaTypeDefinition } from "sanity";

const image = (name = "image", title = "Image") => ({
  name,
  title,
  type: "image" as const,
  options: { hotspot: true },
  fields: [
    { name: "alt", title: "Alt text", type: "string", description: "Describe the image for screen readers." },
  ],
});

const caseStudy: SchemaTypeDefinition = {
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r: any) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r: any) => r.required() },
    { name: "client", title: "Client", type: "string" },
    { name: "sector", title: "Sector", type: "string" },
    { name: "year", title: "Year", type: "number" },
    { name: "summary", title: "Summary", type: "text", rows: 3, description: "One or two sentences. Shown on the card." },
    image("cover", "Cover image"),
    { name: "order", title: "Order", type: "number", description: "Lower numbers appear first." },
  ],
  preview: { select: { title: "title", subtitle: "client", media: "cover" } },
};

const client: SchemaTypeDefinition = {
  name: "client",
  title: "Client logo",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (r: any) => r.required() },
    image("logo", "Logo"),
    { name: "order", title: "Order", type: "number" },
  ],
  preview: { select: { title: "name", media: "logo" } },
};

const testimonial: SchemaTypeDefinition = {
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    { name: "quote", title: "Quote", type: "text", rows: 4, validation: (r: any) => r.required() },
    { name: "author", title: "Author", type: "string", validation: (r: any) => r.required() },
    { name: "role", title: "Role and company", type: "string" },
    { name: "order", title: "Order", type: "number" },
  ],
  preview: { select: { title: "author", subtitle: "role" } },
};

const journalPost: SchemaTypeDefinition = {
  name: "journalPost",
  title: "Journal post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r: any) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r: any) => r.required() },
    { name: "publishedAt", title: "Published", type: "datetime", validation: (r: any) => r.required() },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3 },
    image("cover", "Cover image"),
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }, image()] },
  ],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "cover" } },
};

export const schemaTypes = [caseStudy, client, testimonial, journalPost];
