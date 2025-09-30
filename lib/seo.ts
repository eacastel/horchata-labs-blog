// ==============================
// lib/seo.ts (central SEO util)
// ==============================
export function defaultMetadata(locale: string) {
const isEs = locale === 'es'
return {
title: isEs ? 'Horchata Labs — Estrategia Digital, SEO y Funnels' : 'Horchata Labs — Digital Strategy, SEO & Funnels',
description: isEs
? 'Consultoría de marketing digital, SEO técnico y embudos de conversión. Horchata Labs impulsa tu negocio con contenidos, funnels y optimización internacional.'
: 'Digital marketing consulting, technical SEO, and conversion funnels. Horchata Labs drives growth with content, funnels, and international optimization.',
keywords: isEs
? 'Horchata Labs, SEO, marketing digital, embudos, internacionalización, consultoría'
: 'Horchata Labs, SEO, digital marketing, funnels, internationalization, consulting',
openGraph: {
type: 'website',
locale: isEs ? 'es_ES' : 'en_US',
siteName: 'Horchata Labs',
},
twitter: { card: 'summary_large_image', site: '@horchatalabs' },
}
}


export function postMetadata(post: any, locale: string) {
const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://horchatalabs.com'
return {
title: post.title,
description: post.excerpt || (locale === 'es' ? 'Artículo del blog Horchata Labs' : 'Horchata Labs blog post'),
keywords: post.tags?.join(', '),
openGraph: {
type: 'article',
url: `${base}/${locale}/blog/${post.slug}`,
images: post.coverImage ? [{ url: post.coverImage }] : [],
},
}
}