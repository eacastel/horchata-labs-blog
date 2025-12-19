import { getSiteContent } from "../../../lib/getSiteContent";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = await getSiteContent(locale);

  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">About</h1>
        <p className="text-neutral-700 dark:text-neutral-200">
          {c.brand} is a small, senior-led team focused on accountability, stability, and clean execution.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-950 space-y-3">
          <h2 className="text-xl font-semibold">How we work</h2>
          <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-200">
            <li>Small client roster, high ownership</li>
            <li>Clear boundaries and predictable process</li>
            <li>Systems-first thinking, not random tactics</li>
          </ul>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-950 space-y-3">
          <h2 className="text-xl font-semibold">What we avoid</h2>
          <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-200">
            <li>One-off rescues without ongoing accountability</li>
            <li>“SEO packages” and checkbox deliverables</li>
            <li>Vanity metrics and reporting theater</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
