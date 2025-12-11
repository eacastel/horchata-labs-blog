// app/[locale]/contact/page.tsx

import { getTranslations } from "next-intl/server";
import Link from "next/link";
import ContactForm from "./ContactForm";
import { submitContact } from "./actions";

export default async function Contact(props: {
  params: Promise<{ locale: string }> | { locale: string };
  searchParams?:
    | Promise<{ sent?: string; error?: string }>
    | { sent?: string; error?: string };
}) {
  // Normalize params (handles plain object or Promise)
  const rawParams = props.params;
  const { locale } =
    rawParams && typeof (rawParams as any).then === "function"
      ? await (rawParams as Promise<{ locale: string }>)
      : (rawParams as { locale: string });

  // Normalize searchParams
  const rawSearch = props.searchParams;
  const searchParams =
    rawSearch && typeof (rawSearch as any).then === "function"
      ? await (rawSearch as Promise<{ sent?: string; error?: string }>)
      : ((rawSearch ?? {}) as { sent?: string; error?: string });

  const t = await getTranslations({ locale, namespace: "contact" });

  const sent = searchParams.sent === "1";
  const error = searchParams.error === "1";

  // Bind to match (prevState, formData)
  const action = submitContact.bind(null);

  const whatsappNumber = "34616189198";
  const prefill = encodeURIComponent(t("prefill"));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefill}`;

  return (
    <section className="space-y-4">
      {sent && <p className="text-sm text-green-600">{t("success")}</p>}
      {error && <p className="text-sm text-red-600">{t("error.generic")}</p>}

      {/* Optional WhatsApp CTA */}
      {false && (
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 border rounded hover:bg-brand hover:text-black hover:opacity-90"
        >
          {t("button")}
        </Link>
      )}

      <ContactForm locale={locale} action={action} />
    </section>
  );
}
