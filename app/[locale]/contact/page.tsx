// app/[locale]/contact/page.tsx

import { getTranslations } from "next-intl/server";
import ContactForm from "./ContactForm";
import { submitContact } from "./actions";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ sent?: string; error?: string }>;
};

export default async function Contact({ params, searchParams }: ContactPageProps) {
  const { locale } = await params;

  const sp = (await searchParams) ?? {};
  const sent = sp.sent === "1";
  const error = sp.error === "1";

  const t = await getTranslations({ locale, namespace: "contact" });

  // Bind to match (prevState, formData)
  const action = submitContact.bind(null);

  return (
    <section className="space-y-4">
      {sent && <p className="text-sm text-green-600">{t("success")}</p>}
      {error && <p className="text-sm text-red-600">{t("error.generic")}</p>}

      <ContactForm locale={locale} action={action} />
    </section>
  );
}
