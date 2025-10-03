
// app/robots.txt/route.ts

export async function GET() {
const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://horchatalabs.com'
return new Response(`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml`, { headers: { 'Content-Type': 'text/plain' } })
}