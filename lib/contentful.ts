// lib/contentful.ts
import {createClient, type Entry, type EntrySkeletonType} from 'contentful';

type BlogPostFields = {
  title: string;
  slug: string;
  excerpt?: string;
  body: any;
  coverImage?: any; // you can type Asset if you want: import type {Asset} from 'contentful';
  tags?: string[];
  authorName?: string;
  publishedDate?: string;
};

// Contentful v10 typing pattern
export type BlogPostSkeleton = EntrySkeletonType & {
  contentTypeId: 'blogPost';
  fields: BlogPostFields;
};

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_CDA_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

type Post = {
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
    // Use arrays for select/order:
    // select: ['fields'], // optional – you can omit select entirely
    order: ['-fields.publishedDate'],
    locale,
    limit: 50,
  });

  return res.items.map((it) => ({
    title: it.fields.title,
    slug: it.fields.slug,
    excerpt: it.fields.excerpt,
    body: it.fields.body,
    coverImage:
      (it.fields as any).coverImage?.fields?.file?.url
        ? 'https:' + (it.fields as any).coverImage.fields.file.url
        : undefined,
    tags: it.fields.tags,
    authorName: it.fields.authorName,
    publishedDate: it.fields.publishedDate,
  }));
}

export async function getPostBySlug(
  slug: string,
  locale: string,
): Promise<Post | null> {
  const res = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
    locale,
  });

  const item = res.items[0];
  if (!item) return null;

  return {
    title: item.fields.title,
    slug: item.fields.slug,
    excerpt: item.fields.excerpt,
    body: item.fields.body,
    coverImage:
      (item.fields as any).coverImage?.fields?.file?.url
        ? 'https:' + (item.fields as any).coverImage.fields.file.url
        : undefined,
    tags: item.fields.tags,
    authorName: item.fields.authorName,
    publishedDate: item.fields.publishedDate,
  };
}

export async function listSlugsByLocale(locale: string): Promise<string[]> {
  const res = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blogPost',
    select: ['fields.slug'],
    locale,
    limit: 1000,
  });
  return res.items.map((it) => it.fields.slug);
}
