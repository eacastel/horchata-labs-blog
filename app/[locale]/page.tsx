// app/[locale]/page.tsx (Home)

import { getTranslations } from "next-intl/server";

export default async function Home({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {t("home.title")}
      </h1>
      <p>
        Lightweight Next.js starter with i18n, Contentful, Tailwind, and a clean
        blog to repurpose for site + funnels.
      </p>
      <a
        href={`/${params.locale}/contact`}
        className="inline-block px-4 py-2 border rounded hover:bg-brand hover:text-black"
      >
        {t("home.cta")}
      </a>
    </section>
  );
}
