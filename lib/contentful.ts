// ==============================
// lib/contentful.ts
// ==============================
import { createClient } from 'contentful'


type Post = {
    title: string
    slug: string
    excerpt?: string
    body: any
    coverImage?: string
    tags?: string[]
    authorName?: string
    publishedDate?: string
}


const space = process.env.CONTENTFUL_SPACE_ID!
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const token = process.env.CONTENTFUL_CDA_TOKEN!


const client = createClient({ space, environment, accessToken: token })


export async function listPosts(locale: string): Promise<Post[]> {
    const res = await client.getEntries({ content_type: 'blogPost', select: 'fields', locale, order: '-fields.publishedDate', limit: 50 })
    return res.items.map((it: any) => ({
        title: it.fields.title,
        slug: it.fields.slug,
        excerpt: it.fields.excerpt,
        body: it.fields.body,
        coverImage: it.fields.coverImage?.fields?.file?.url ? 'https:' + it.fields.coverImage.fields.file.url : undefined,
        tags: it.fields.tags,
        authorName: it.fields.authorName,
        publishedDate: it.fields.publishedDate,
    }))
}


export async function getPostBySlug(slug: string, locale: string): Promise<Post | null> {
    const res = await client.getEntries({ content_type: 'blogPost', 'fields.slug': slug, limit: 1, locale })
    const item: any = res.items[0]
    if (!item) return null
    return {
        title: item.fields.title,
        slug: item.fields.slug,
        excerpt: item.fields.excerpt,
        body: item.fields.body,
        coverImage: item.fields.coverImage?.fields?.file?.url ? 'https:' + item.fields.coverImage.fields.file.url : undefined,
        tags: item.fields.tags,
        authorName: item.fields.authorName,
        publishedDate: item.fields.publishedDate,
    }
}


export async function listSlugsByLocale(locale: string): Promise<string[]> {
    const res = await client.getEntries({ content_type: 'blogPost', select: 'fields.slug', locale, limit: 1000 })
    return res.items.map((it: any) => it.fields.slug)
}