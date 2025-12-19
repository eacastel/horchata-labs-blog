// app/[locale]/layout.tsx
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import LanguageSwitch from "./LanguageSwitch";
import { defaultMetadata, defaultViewport } from "../../lib/seo";
import "../globals.css";
import Link from "next/link";
import Script from "next/script";
import { getTranslations } from "next-intl/server";
import { BotIdClient } from "botid/client";
import { getBrand } from "@lib/getBrand";
import { getBrandConfig } from "@lib/brands";

const locales = (process.env.NEXT_PUBLIC_AVAILABLE_LOCALES || "en,es").split(
  ","
);
const DISABLE_BOTID = process.env.NEXT_PUBLIC_DISABLE_BOTID === "1";

// --- generateMetadata: params is now a Promise<{ locale }>

export const viewport: Viewport = defaultViewport;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const brandKey = await getBrand();
  const brand = getBrandConfig(brandKey);

  // If you want, pass brand into your metadata later.
  // For now keep your existing metadata stable:
  return defaultMetadata(locale);
}

// BOTID routes (must match your POST targets)
const protectedRoutes = [
  { path: "/en/contact", method: "POST" },
  { path: "/es/contact", method: "POST" },
];

// --- Layout: params is now Promise<{ locale }>
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "footer" });
  const year = new Date().getFullYear();
  const brandKey = await getBrand();
  const brandCfg = getBrandConfig(brandKey);
  const brand = brandCfg.name;

  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {!DISABLE_BOTID && <BotIdClient protect={protectedRoutes} />}

        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}
      </head>

      <body className="font-sans text-base text-neutral-900 antialiased md:mx-2">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <NextIntlClientProvider locale={locale} messages={messages}>
          <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <nav
              className={`max-w-content mx-auto flex items-center justify-between px-4 ${brandCfg.navPaddingYClassName} ${brandCfg.navHeightClassName}`}
            >
              <Link
                href={`/${locale}`}
                className="flex items-center"
                aria-label={`${brand} Home`}
              >
                {/* Logo wrapper defines the vertical footprint */}
                <div
                  className={`${brandCfg.navHeightClassName} flex items-center`}
                >
                  <picture>
                    <source
                      srcSet={brandCfg.logoDark}
                      media="(prefers-color-scheme: dark)"
                    />
                    <img
                      src={brandCfg.logoLight}
                      alt={brand}
                      className={`${brandCfg.logoClassName} w-auto object-contain`}
                      loading="eager"
                      decoding="async"
                    />
                  </picture>
                </div>
              </Link>

              <div className="flex gap-4 text-sm items-center">
                <Link
                  href={`/${locale}/services`}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-brand"
                >
                  Services
                </Link>
                <Link
                  href={`/${locale}/diagnostic`}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-brand"
                >
                  Diagnostic
                </Link>
                <Link
                  href={`/${locale}/work`}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-brand"
                >
                  Work
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-brand"
                >
                  About
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-brand"
                >
                  {tNav("contact")}
                </Link>

                <LanguageSwitch locale={locale} />
              </div>
            </nav>
          </header>

          <main className="max-w-content mx-auto p-4">{children}</main>

          <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300">
            <div className="max-w-content mx-auto p-4 text-sm">
              {t("rights", { year, brand })}
            </div>
          </footer>
        </NextIntlClientProvider>

        {/* Aliigo widget script left commented as in your original */}
      </body>
    </html>
  );
}
