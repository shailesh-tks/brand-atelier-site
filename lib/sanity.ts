import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset, apiVersion, configured } from "@/sanity/env";

export const sanity = configured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

const builder = sanity ? imageUrlBuilder(sanity) : null;

export function urlFor(source: unknown, width: number) {
  if (!builder || !source) return null;
  return builder.image(source as never).width(width).fit("max").auto("format").url();
}

/** Every query returns empty when Sanity isn't configured, so S5 just doesn't render. */
async function query<T>(groq: string): Promise<T[]> {
  if (!sanity) return [];
  try {
    return await sanity.fetch<T[]>(groq, {}, { next: { revalidate: 60 } });
  } catch {
    // A CMS outage must never take the marketing page down with it.
    return [];
  }
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
