// app/[locale]/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import LanguageSwitch from "./LanguageSwitch";
import { defaultMetadata } from "../../lib/seo";
import "../globals.css";
import Link from "next/link";
import Script from "next/script";
import { getTranslations } from "next-intl/server";

// Safe import; we’ll guard rendering below
import { BotIdClient } from "botid/client";

const locales = (process.env.NEXT_PUBLIC_AVAILABLE_LOCALES || "en,es").split(
  ","
);
const DISABLE_BOTID = process.env.NEXT_PUBLIC_DISABLE_BOTID === "1";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return defaultMetadata(params.locale);
}

// BOTID routes (must match your POST targets)
const protectedRoutes = [
  { path: "/en/contact", method: "POST" },
  { path: "/es/contact", method: "POST" },
];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!locales.includes(locale)) notFound();
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = await getTranslations({ locale, namespace: "footer" });
  const year = new Date().getFullYear();
  const brand = "Horchata Labs";

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

        {/* Render BotID client only when enabled */}
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
            <nav className="max-w-content mx-auto flex items-center justify-between p-4">
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100"
                aria-label="Horchata Labs Home"
              >
                <picture className="mx-2">
                  <source
                    srcSet="/images/horchata-mark-dark.png"
                    media="(prefers-color-scheme: dark)"
                  />
                  <img
                    src="/images/horchata-mark-light.png"
                    alt="Horchata Labs"
                    width={100}
                    height={100}
                    className="rounded-md"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              </Link>

              <div className="flex gap-4 text-sm items-center">
                {/*
                 <Link href={`/${locale}/blog`} className="text-neutral-700 dark:text-neutral-200 hover:text-brand">
                  Blog
                </Link>
                */}
                <Link
                  href={`/${locale}/contact`}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-brand"
                >
                  Contact
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

        {/* <Script id="aliigo-widget" strategy="afterInteractive">
{`
(function () {
  var base  = '${process.env.NEXT_PUBLIC_ALIIGO_ORIGIN ?? "https://aliigo.vercel.app"}';
  var slug  = 'horchata-labs';
  var brand = 'Aliigo';
  var token = '${process.env.NEXT_PUBLIC_ALIIGO_TOKEN ?? ""}';
  if (!token) { console.warn("[Aliigo] Missing token"); return; }

  var theme = encodeURIComponent(JSON.stringify({
    headerBg: "bg-gray-900",
    headerText: "text-white",
    bubbleUser: "bg-blue-600 text-white",
    bubbleBot: "bg-gray-100 text-gray-900",
    sendBg: "bg-blue-600",
    sendText: "text-white"
  }));

  var url = base + '/embed/chat'
    + '?slug='  + encodeURIComponent(slug)
    + '&brand=' + encodeURIComponent(brand)
    + '&token=' + encodeURIComponent(token)
    + '&theme=' + theme;

  var iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.title = 'Aliigo chat';
  iframe.style.position = 'fixed';
  iframe.style.bottom   = '24px';
  iframe.style.right    = '24px';
  iframe.style.width    = '360px';
  iframe.style.height   = '420px';
  iframe.style.border   = '0';
  iframe.style.zIndex   = '2147483647';

  function applyMobileSize() {
    if (window.innerWidth < 480) {
      iframe.style.width  = '100%';
      iframe.style.right  = '0';
      iframe.style.left   = '0';
      iframe.style.height = '50vh';
      iframe.style.bottom = '0';
    } else {
      iframe.style.width  = '360px';
      iframe.style.height = '420px';
      iframe.style.right  = '24px';
      iframe.style.left   = '';
    }
  }

  window.addEventListener('resize', applyMobileSize);
  document.body.appendChild(iframe);
  applyMobileSize();
})();
`}
</Script> */}

      </body>
    </html>
  );
}
