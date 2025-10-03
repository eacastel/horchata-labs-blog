
// README.md (ops + reuse plan)


# Horchata Labs – Next.js Blog Starter (Tailwind + i18n + Contentful)

**Goals:** ES/EN i18n; cookie `hl_lang`; geo default (Spain → `es`); Contentful-backed blog; Tailwind + Typography; SEO (metadata, OG/Twitter, sitemap, robots, RSS). Ready to repurpose for HL site + funnels.

## 1) Setup

```bash
pnpm i
cp .env.local .env.local.example # create your own if missing
pnpm dev
```

## 2) Tailwind

- Config in `tailwind.config.js` with brand color (#f2b425) and typography plugin.
- Global directives in `app/globals.css`.

## 3) Contentful & i18n

- Locales: `en-US` (default), `es-ES`.
- Content type `blogPost` per `contentful/content-model.md`.
- Locale-prefixed routes via `middleware.ts`.

## 4) SEO / Mother Bear

- Central metadata in `lib/seo.ts` + per-post metadata.
- Sitemap `/sitemap.xml`, Robots `/robots.txt`, RSS `public/rss.xml` (via `pnpm rss`).
- Next steps: JSON-LD, Next/Image loader, tag/category pages.

## 5) Deploy (Vercel)

- Set env vars: `CONTENTFUL_*`, `NEXT_PUBLIC_*`.
- Build: `pnpm build`.
- Validate OG/Twitter tags and sitemap/robots.
