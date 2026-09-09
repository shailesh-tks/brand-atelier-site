/** Single source of truth for anything that needs the live domain. */
export const site = {
  // Set NEXT_PUBLIC_SITE_URL once the domain is pointed. Metadata, the sitemap
  // and the structured data all read from here.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brandatelier.example",
  name: "Brand Atelier",
  legalName: "The Brand Atelier",
  tagline: "Brands. Positioned to Lead.",
  description:
    "We help brands become distinctive, desirable, and worth choosing. Brand positioning for businesses entering and growing in new markets.",
  email: "thebrandatelier.co.in@gmail.com",
} as const;

/** Prefix a public asset with the deploy's base path (empty outside Pages). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
