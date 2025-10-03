// lib/contentful.ts
import { createClient } from 'contentful';

// ---- App-level type (clean) ----
export type Post = {
  title: string;
  slug: string;
  excerpt?: string;
  body: any;
  coverImage?: string;
  tags?: string[];
  authorName?: string;
  publishedDate?: string;
};

// ---- Map app locales ('en','es') to Contentful locales ----
const CF_LOCALE_MAP: Record<string, string> = { en: 'en-US', es: 'es-ES' };
function cfLocale(locale: string) {
  return CF_LOCALE_MAP[locale] ?? locale;
}

// ---- Contentful client ----
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_CDA_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

// ---- Runtime validator: Entry -> Post | null ----
function toPost(entry: unknown): Post | null {
  // We only rely on the minimal shape we actually use
  const e = entry as { fields?: any } | null | undefined;
  const f = e?.fields ?? {};

  const title = typeof f.title === 'string' ? f.title : undefined;
  const slug = typeof f.slug === 'string' && f.slug.trim().length > 0 ? f.slug : undefined;

  if (!title || !slug) return null; // must have both in the current locale

  const body = f.body; // rich text or whatever you stored
  const excerpt = typeof f.excerpt === 'string' ? f.excerpt : undefined;
  const authorName = typeof f.authorName === 'string' ? f.authorName : undefined;
  const publishedDate = typeof f.publishedDate === 'string' ? f.publishedDate : undefined;

  const tags =
    Array.isArray(f.tags) ? (f.tags.filter((t: unknown) => typeof t === 'string') as string[]) : undefined;

  const coverImageUrl = f.coverImage?.fields?.file?.url as string | undefined;
  const coverImage = normalizeImageUrl(coverImageUrl);

  return { title, slug, excerpt, body, coverImage, tags, authorName, publishedDate };
}

// ---- Public API ----
export async function listPosts(locale: string): Promise<Post[]> {
  const res = await client.getEntries({
    content_type: 'blogPost',
    order: ['-fields.publishedDate'], // array form keeps TS + SDK happy
    locale: cfLocale(locale),
    limit: 50,
  } as any); // <-- relax SDK typing at the edge

  const items = Array.isArray((res as any).items) ? (res as any).items : [];
  return items.map(toPost).filter((p: Post | null): p is Post => p !== null);
}

export async function getPostBySlug(slug: string, locale: string): Promise<Post | null> {
  const res = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
    locale: cfLocale(locale),
  } as any);

  const item = (res as any).items?.[0];
  return toPost(item);
}

export async function listSlugsByLocale(locale: string): Promise<string[]> {
  const res = await client.getEntries({
    content_type: 'blogPost',
    select: ['fields.slug'],
    locale: cfLocale(locale),
    limit: 1000,
  } as any);

  const items = Array.isArray((res as any).items) ? (res as any).items : [];
  return items
    .map((e: any) => e?.fields?.slug as string | undefined)
    .filter((s: string | undefined): s is string => typeof s === 'string' && s.trim().length > 0);
}

// ---- helpers ----
function normalizeImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url.startsWith('http') ? url : `https:${url}`;
}
