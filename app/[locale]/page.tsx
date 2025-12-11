// app/[locale]/page.tsx

import { getTranslations } from "next-intl/server";
import ContactSuccessBanner from "./ContactSuccessBanner";

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Resolve the promises (Next 15)
  const { locale } = await params;
  const allSearchParams = await searchParams;

  const t = await getTranslations({ locale });

  const contactParam = allSearchParams.contact;
  const showContactSuccess =
    contactParam === "ok" ||
    (Array.isArray(contactParam) && contactParam.includes("ok"));

  return (
    <section className="space-y-6">
      {showContactSuccess && (
        <ContactSuccessBanner message={t("contact.success")} />
      )}

      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {t("home.title")}
      </h1>

      <p className="whitespace-pre-line">{t("home.intro")}</p>

      <a
        href={`/${locale}/contact`}
        className="inline-block mx-2 px-4 py-2 border rounded hover:bg-brand hover:text-black"
      >
        {t("home.cta")}
      </a>
    </section>
  );
}
