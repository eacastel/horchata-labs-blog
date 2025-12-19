import Link from "next/link";
import { getSiteContent } from "../../../lib/getSiteContent";

export default async function DiagnosticPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = await getSiteContent(locale);

  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">{c.diagnostic.title}</h1>
        <p className="text-neutral-700 dark:text-neutral-200">
          {c.diagnostic.description}
        </p>
      </header>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-950 space-y-3">
        <div className="text-neutral-700 dark:text-neutral-200">
          <span className="font-semibold">Diagnostic:</span> {c.diagnostic.price}
        </div>
        <div className="text-neutral-700 dark:text-neutral-200">
          <span className="font-semibold">Retainer floor:</span>{" "}
          {c.diagnostic.retainerNote}
        </div>

        <Link
          href={c.diagnostic.cta.href}
          className="inline-block px-4 py-2 border rounded hover:bg-brand hover:text-black hover:opacity-90"
        >
          {c.diagnostic.cta.label}
        </Link>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">What you get</h2>
        <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-200">
          <li>Infrastructure and platform risk review</li>
          <li>Visibility health check (technical SEO + structure)</li>
          <li>Measurement integrity review (GA4/GTM + conversions)</li>
          <li>Prioritized findings and next steps</li>
        </ul>
      </div>
    </section>
  );
}
