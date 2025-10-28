import { getTranslations } from "next-intl/server";
import { submitContact } from "./actions";
import Link from "next/link";
import ContactForm from "./ContactForm";

export default async function Contact({ params }: { params:{ locale:string } }) {
  const t = await getTranslations("contact");
  const { locale } = params;

  const whatsappNumber = "34616189198";
  const prefill = encodeURIComponent(t("prefill"));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefill}`;

  return (
    <section className="space-y-4">
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 border rounded hover:bg-brand hover:text-black hover:opacity-90"
      >
        {t("button")}
      </Link>

      <ContactForm
        locale={locale}
        action={submitContact}
        t={(k) => t(k)}
      />
    </section>
  );
}
