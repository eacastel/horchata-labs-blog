
// app/sitemap.ts

import { listSlugsByLocale } from '../lib/contentful'


export default async function sitemap() {
    const locales = (process.env.NEXT_PUBLIC_AVAILABLE_LOCALES || 'en,es').split(',')
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://horchatalabs.com'
    const routes = ['', '/blog', '/contact']
    const items: { url: string; lastModified?: string }[] = []
    for (const l of locales) {
        for (const r of routes) items.push({ url: `${base}/${l}${r}` })
        const slugs = await listSlugsByLocale(l)
        slugs.forEach(s => items.push({ url: `${base}/${l}/blog/${s}` }))
    }
    return items
}