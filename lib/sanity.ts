import { projectId, dataset, apiVersion, configured } from "@/sanity/env";

/**
 * Sanity content, fetched over its HTTP API with no client library.
 *
 * `next-sanity` pulls in the whole studio toolchain — 113MB of node_modules
 * for what is, at read time, a GET request with a GROQ query string. Plain
 * fetch also lets Next's own cache handle revalidation directly.
 */

/** Every query returns empty when Sanity isn't configured, so S5 doesn't render. */
async function query<T>(groq: string): Promise<T[]> {
  if (!configured) return [];
  const url =
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(groq)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const body = (await res.json()) as { result?: T[] };
    return body.result ?? [];
  } catch {
    // A CMS outage must never take the marketing page down with it.
    return [];
  }
}

/**
 * Sanity image refs are deterministic:
 *   image-<assetId>-<width>x<height>-<ext>
 * so a CDN URL can be assembled without @sanity/image-url.
 */
export function urlFor(source: unknown, width: number): string | null {
  if (!configured) return null;
  const ref = (source as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
  if (!ref) return null;
  const m = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!m) return null;
  const [, assetId, dimensions, ext] = m;
  return (
    `https://cdn.sanity.io/images/${projectId}/${dataset}/` +
    `${assetId}-${dimensions}.${ext}?w=${width}&fit=max&auto=format`
  );
}

export type CaseStudy = {
  _id: string; title: string; client?: string; sector?: string;
  year?: number; summary?: string; cover?: { alt?: string };
};
export type Client = { _id: string; name: string; logo?: { alt?: string } };
export type Testimonial = { _id: string; quote: string; author: string; role?: string };

export const getCaseStudies = () =>
  query<CaseStudy>(`*[_type == "caseStudy"]|order(coalesce(order, 999) asc, year desc)[0...6]{
    _id, title, client, sector, year, summary, cover
  }`);

export const getClients = () =>
  query<Client>(`*[_type == "client"]|order(coalesce(order, 999) asc)[0...24]{ _id, name, logo }`);

export const getTestimonials = () =>
  query<Testimonial>(`*[_type == "testimonial"]|order(coalesce(order, 999) asc)[0...6]{
    _id, quote, author, role
  }`);
