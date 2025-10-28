import { getTranslations } from "next-intl/server";
import { submitContact } from "./actions";
import Link from "next/link";

export default async function Contact({ params }: { params:{ locale:string } }) {
  const t = await getTranslations("contact");
  const { locale } = params;

  const whatsappNumber = "34616189198";
  const prefill = encodeURIComponent(t("prefill"));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefill}`;

  return (
    <section className="space-y-4">
      {/* WhatsApp CTA */}
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "inline-block px-6 py-3 rounded-lg border font-medium transition-opacity",
"inline-block px-4 py-2 border rounded hover:bg-brand hover:text-black",
          "hover:opacity-90",
        ].join(" ")}
      >
        {t("button")}
      </Link>

      {/* Contact Form (Server Action + BotID + honeypot) */}
      <form action={submitContact} className="space-y-3 max-w-md" noValidate>
        {/* pass locale for i18n subjects */}
        <input type="hidden" name="locale" value={locale} />
        {/* honeypot */}
        <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

        <input
          name="name"
          placeholder={locale === "es" ? "Tu nombre" : "Your name"}
          className="w-full border p-2 rounded bg-white dark:bg-neutral-900"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="you@company.com"
          className="w-full border p-2 rounded bg-white dark:bg-neutral-900"
          required
        />
        <textarea
          name="message"
          placeholder={locale === "es" ? "Cuéntanos sobre tu proyecto." : "Tell us about your project."}
          className="w-full border p-2 rounded h-32 bg-white dark:bg-neutral-900"
          required
        />
        <button
          type="submit"
          className={[
            "inline-flex items-center justify-center px-5 py-2 rounded-md border font-medium transition-opacity",
"inline-block px-4 py-2 border rounded hover:bg-brand hover:text-black",
            "hover:opacity-90",
          ].join(" ")}
        >
          {locale === "es" ? "Enviar" : "Send"}
        </button>
      </form>
    </section>
  );
}
