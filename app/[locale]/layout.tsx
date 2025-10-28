// app/[locale]/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";
import { NextIntlClientProvider } from "next-intl";
import { defaultMetadata } from "../../lib/seo";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";

const locales = (process.env.NEXT_PUBLIC_AVAILABLE_LOCALES || "en,es").split(
  ","
);

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return defaultMetadata(params.locale);
}

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

  return (
    <html lang={locale}>
      <body className="font-sans text-base text-neutral-900 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <nav className="max-w-content mx-auto flex items-center justify-between p-4">
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100"
              >
                <picture>
                  {/* Only one image is fetched depending on system theme */}
                  <source
                    srcSet="/images/horchata-mark-light.png"
                    media="(prefers-color-scheme: dark)"
                  />
                  <img
                    src="/images/horchata-mark-dark.png"
                    alt="Horchata Labs"
                    width={170}
                    height={170}
                    className="rounded-md"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              </Link>

              <div className="flex gap-4 text-sm items-center">
                <Link
                  href={`/${locale}/blog`}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-brand"
                >
                  Blog
                </Link>
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
              © {new Date().getFullYear()} Horchata Labs. All rights reserved.
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
