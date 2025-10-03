
// scripts/build-rss.ts (simple RSS)

import fs from 'node:fs'
import path from 'node:path'
import { listPosts } from '@lib/contentful';


async function main() {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://horchatalabs.com'
    const locales = (process.env.NEXT_PUBLIC_AVAILABLE_LOCALES || 'en,es').split(',')
    let items = ''
    for (const l of locales) {
        const posts = await listPosts(l)
        for (const p of posts) {
            items += `\n <item>\n <title><![CDATA[${p.title}]]></title>\n <link>${base}/${l}/blog/${p.slug}</link>\n <description><![CDATA[${p.excerpt || ''}]]></description>\n <pubDate>${new Date(p.publishedDate || Date.now()).toUTCString()}</pubDate>\n </item>`
        }
    }
    const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?><rss version=\"2.0\"><channel><title>Horchata Labs</title><link>${base}</link><description>Blog RSS</description>${items}\n</channel></rss>`
    const out = path.join(process.cwd(), 'public', 'rss.xml')
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, xml)
    console.log('Wrote', out)
}
main()