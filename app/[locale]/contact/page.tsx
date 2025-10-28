import { getTranslations } from "next-intl/server";
import Link from "next/link";
import ContactForm from "./ContactForm";
import { submitContact } from "./actions"; // or your inline action

export default async function Contact({ params, searchParams }: {
  params: { locale: string };
  searchParams: { sent?: string; error?: string };
}) {
  const { locale } = params;
  const t = await getTranslations("contact");

  const sent = searchParams?.sent === "1";
  const error = searchParams?.error === "1";

  // IMPORTANT: bind to satisfy (prevState, formData) signature
  const action = submitContact.bind(null);

  const whatsappNumber = "34616189198";
  const prefill = encodeURIComponent(t("prefill"));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefill}`;

  return (
    <section className="space-y-4">
      {sent && <p className="text-sm text-green-600">{t("success")}</p>}
      {error && <p className="text-sm text-red-600">{t("error.generic")}</p>}

      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer"
        className="inline-block px-4 py-2 border rounded hover:bg-brand hover:text-black hover:opacity-90">
        {t("button")}
      </Link>

      {/* DO NOT pass t here */}
      <ContactForm locale={locale} action={action} />
    </section>
  );
}
