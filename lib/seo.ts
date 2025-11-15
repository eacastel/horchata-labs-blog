// lib/seo.ts
import type { Metadata } from "next";

const SITE_NAME = "Horchata Labs";
const SITE_DESC_EN =
  "Horchata Labs is a premium boutique creative-tech agency in Valencia specializing in technical SEO, digital branding, and high-performance Next.js websites for brands that demand quality. We integrate analytics, automation, and AI-assisted strategy to keep you ahead.";
const SITE_DESC_ES =
  "Horchata Labs es una agencia boutique creativo-tecnológica con sede en Valencia, especializada en posicionamiento digital, branding y SEO técnico. Creamos webs en Next.js para marcas que exigen calidad. Impulsamos tu posicionamiento con IA, analítica y automatización.";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://horchatalabs.com").replace(/\/+$/, "");

const abs = (p: string) => (p.startsWith("http") ? p : `${BASE_URL}${p}`);

export function defaultMetadata(locale: string): Metadata {
  const isEs = locale === "es";
  const title = isEs
    ? "Horchata Labs — Agencia Boutique Creativo-Tecnológica en Valencia · SEO Técnico, Branding y Web Next.js"
    : "Horchata Labs — Premium Boutique Creative-Tech Agency in Valencia · Technical SEO, Branding & Next.js Web";
  const description = isEs ? SITE_DESC_ES : SITE_DESC_EN;

  return {
    title,
    description,
    applicationName: SITE_NAME,
    keywords: isEs
      ? ["agencia", "Valencia", "SEO", "analítica", "branding", "desarrollo web", "funnel", "marketing"]
      : ["agency", "Valencia", "SEO", "analytics", "branding", "web development", "funnel", "marketing"],
    alternates: {
      languages: {
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
      },
    },

    openGraph: {
      type: "website",
      locale: isEs ? "es_ES" : "en_US",
      siteName: SITE_NAME,
      title,
      description,
      url: `${BASE_URL}/${locale}`,
      images: [
        {
          url: abs("/og/horchata-og.png"),
          width: 1200,
          height: 630,
          alt: "Horchata Labs",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [abs("/og/horchata-og.png")],
    },

    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },

    manifest: "/site.webmanifest",

    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
    robots: { index: true, follow: true },
  };
}

export function postMetadata(
  post: { title: string; excerpt?: string; coverImage?: string; slug: string },
  locale: string
): Metadata {
  const url = `${BASE_URL}/${locale}/blog/${post.slug}`;
  const description =
    post.excerpt ||
    (locale === "es" ? "Artículo del blog Horchata Labs" : "Horchata Labs blog post");

  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      images: [
        post.coverImage ? abs(post.coverImage) : abs("/og/horchata-og.png"),
      ],
      siteName: SITE_NAME,
      locale: locale === "es" ? "es_ES" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [post.coverImage ? abs(post.coverImage) : abs("/og/horchata-og.png")],
    },
  };
}
