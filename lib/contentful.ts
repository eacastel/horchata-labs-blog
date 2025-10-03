// lib/contentful.ts
import {createClient, type EntrySkeletonType} from 'contentful';

type BlogPostFields = {
  title: string;
  slug: string;
  excerpt?: string;
  body: any;
  coverImage?: any; // TODO: tighten to Asset type if desired
  tags?: string[];
  authorName?: string;
  publishedDate?: string;
};

// Contentful v10 typing pattern
export type BlogPostSkeleton = EntrySkeletonType & {
  contentTypeId: 'blogPost';
  fields: BlogPostFields;
};

// Map app route locales ('en','es') -> Contentful IDs ('en-US','es-ES')
const CF_LOCALE_MAP: Record<string, string> = { en: 'en-US', es: 'es-ES' };
function cfLocale(locale: string) {
  return CF_LOCALE_MAP[locale] ?? locale; // pass-through if already full ID
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_CDA_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

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

export async function listPosts(locale: string): Promise<Post[]> {
  const res = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blogPost',
    order: ['-fields.publishedDate'],
    locale: cfLocale(locale),
    limit: 50,
  });

  return res.items.map((it) => ({
    title: it.fields.title,
    slug: it.fields.slug,
    excerpt: it.fields.excerpt,
    body: it.fields.body,
    coverImage: normalizeImageUrl((it.fields as any).coverImage?.fields?.file?.url),
    tags: it.fields.tags,
    authorName: it.fields.authorName,
    publishedDate: it.fields.publishedDate,
  }));
}

export async function getPostBySlug(slug: string, locale: string): Promise<Post | null> {
  const res = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
    locale: cfLocale(locale),
  });

  const item = res.items[0];
  if (!item) return null;

  return {
    title: item.fields.title,
    slug: item.fields.slug,
    excerpt: item.fields.excerpt,
    body: item.fields.body,
    coverImage: normalizeImageUrl((item.fields as any).coverImage?.fields?.file?.url),
    tags: item.fields.tags,
    authorName: item.fields.authorName,
    publishedDate: item.fields.publishedDate,
  };
}

export async function listSlugsByLocale(locale: string): Promise<string[]> {
  const res = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blogPost',
    select: ['fields.slug'],
    locale: cfLocale(locale),
    limit: 1000,
  });

  return res.items
    .map((it) => it.fields.slug)                 // inferred as string
    .filter((s) => s && s.length > 0);           // simple boolean filter, no predicate
}

// --- helpers ---
function normalizeImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url.startsWith('http') ? url : `https:${url}`;
}
