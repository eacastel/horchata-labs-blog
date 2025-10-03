// app/[locale]/layout.tsx

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { defaultMetadata } from "../../lib/seo";
import "../globals.css";

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
              <a
                href={`/${locale}`}
                className="font-semibold text-neutral-900 dark:text-neutral-100"
              >
                Horchata Labs
              </a>
              <div className="flex gap-4 text-sm items-center">
                <a
                  href={`/${locale}/blog`}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-brand"
                >
                  Blog
                </a>
                <a
                  href={`/${locale}/contact`}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-brand"
                >
                  Contact
                </a>
                <LangSwitcher locale={locale} />
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

function LangSwitcher({ locale }: { locale: string }) {
  const other = locale === "en" ? "es" : "en";
  return (
    <form action={`/${other}`} method="get">
      <button
        formAction={`/${other}`}
        className="px-2 py-1 border rounded
                   border-neutral-300 text-neutral-800
                   dark:border-neutral-700 dark:text-neutral-100
                   hover:bg-brand hover:text-neutral-900"
      >
        {other.toUpperCase()}
      </button>
    </form>
  );
}
