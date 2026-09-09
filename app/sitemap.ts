import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required for `output: export` — these are generated once at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
