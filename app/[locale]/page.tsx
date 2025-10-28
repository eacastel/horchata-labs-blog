// app/[locale]/page.tsx (Home)

import { getTranslations } from "next-intl/server";


export default async function Home({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  return (
    <section className="space-y-6">
      <h1 className="whitespace-pre-line text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {t("home.title")}
      </h1>
      <p>
        {t("home.intro")}
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
