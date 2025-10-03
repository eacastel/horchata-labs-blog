// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { listSlugsByLocale } from '@lib/contentful';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const locales = (process.env.NEXT_PUBLIC_AVAILABLE_LOCALES || 'en,es')
    .split(',')
    .map((s) => s.trim());

  const staticRoutes = ['', '/blog', '/contact'];

  // If Contentful isn’t configured yet, return just the static routes.
  const hasCF =
    !!process.env.CONTENTFUL_SPACE_ID && !!process.env.CONTENTFUL_CDA_TOKEN;

  const items: MetadataRoute.Sitemap = [];

  for (const l of locales) {
    for (const r of staticRoutes) {
      items.push({ url: `${base}/${l}${r}` });
    }
    if (hasCF) {
      try {
        const slugs = await listSlugsByLocale(l);
        for (const slug of slugs) {
          items.push({ url: `${base}/${l}/blog/${slug}` });
        }
      } catch {
        // Ignore Contentful errors and still serve a sitemap
      }
    }
  }

  return items;
}
