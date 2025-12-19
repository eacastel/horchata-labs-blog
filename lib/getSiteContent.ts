import "server-only";

import type { BrandKey } from "./brand";
import { getBrand } from "./getBrand";

type Locale = "en" | "es";

export type SiteContent = {
  brand: string;

  hero: {
    headline: string;
    subhead: string;
    primaryCta: { label: string; href: string };
  };

  whoFor: { title: string; items: string[] };
  whoNotFor: { title: string; items: string[] };

  pillars: Array<{
    title: string;
    description: string;
    bullets: string[];
  }>;

  proof: {
    title: string;
    items: string[];
    note?: string;
  };

  diagnostic: {
    title: string;
    description: string;
    price: string;
    retainerNote: string;
    cta: { label: string; href: string };
  };

  finalCta: {
    headline: string;
    subhead: string;
    cta: { label: string; href: string };
  };
};

// Avanti is EN-only. Horchata supports EN+ES.
function normalizeLocale(brand: BrandKey, locale: string): Locale {
  if (brand === "avanti") return "en";
  return locale === "es" ? "es" : "en";
}

export async function getSiteContent(locale: string): Promise<SiteContent> {
  const brand = await getBrand();
  const useLocale = normalizeLocale(brand, locale);

  if (brand === "avanti") {
    const mod = await import("../content/avanti/en");
    return mod.default as SiteContent;
  }

  if (useLocale === "es") {
    const mod = await import("../content/horchata/es");
    return mod.default as SiteContent;
  }

  const mod = await import("../content/horchata/en");
  return mod.default as SiteContent;
}
