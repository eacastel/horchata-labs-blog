// lib/seo.ts
import type { Metadata } from "next";

const SITE_NAME = "Horchata Labs";
const SITE_DESC_EN =
  "Horchata Labs is a creative-tech agency in Valencia that helps brands launch, grow, and measure their digital presence through strategy, design, and data-driven marketing.";
const SITE_DESC_ES =
  "Horchata Labs es una agencia creativa y tecnológica en Valencia que ayuda a las marcas a lanzar, crecer y medir su presencia digital mediante estrategia, diseño y marketing basado en datos.";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://horchatalabs.com").replace(/\/+$/, "");

// Helper for absolute URLs (avoids metadataBase quirks)
const abs = (p: string) => (p.startsWith("http") ? p : `${BASE_URL}${p}`);

export function defaultMetadata(locale: string): Metadata {
  const isEs = locale === "es";
  const title = isEs
    ? "Horchata Labs · Agencia digital en Valencia"
    : "Horchata Labs · Creative-tech agency in Valencia";
  const description = isEs ? SITE_DESC_ES : SITE_DESC_EN;

  return {
    // keep it simple: plain string title is the most robust on 14.2.x
    title,
    description,
    applicationName: SITE_NAME,
    keywords: isEs
      ? ["agencia", "Valencia", "SEO", "analítica", "branding", "desarrollo web", "funnel", "marketing"]
      : ["agency", "Valencia", "SEO", "analytics", "branding", "web development", "funnel", "marketing"],

    // avoid metadataBase + alternates.canonical combo if your paths get tricky;
    // languages is safe:
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

    // Keep favicons minimal here to avoid conflicts with manual <link>s in <head>
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
      // omit mask-icon here (add it manually in <head> if you want the color attr)
    },

    // Optional: only if you actually have the file
    // manifest: "/site.webmanifest",

    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
    robots: { index: true, follow: true },
  };
}

// Optional: if your blog uses this; include for completeness
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
