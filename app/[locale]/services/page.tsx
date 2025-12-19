import { getSiteContent } from "../../../lib/getSiteContent";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = await getSiteContent(locale);

  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">{c.pillars.length ? "Services" : "Services"}</h1>
        <p className="text-neutral-700 dark:text-neutral-200">
          {c.brand} focuses on three pillars.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {c.pillars.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-950"
          >
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="mt-2 text-neutral-700 dark:text-neutral-200">
              {p.description}
            </p>
            <ul className="mt-3 list-disc pl-5 text-neutral-700 dark:text-neutral-200">
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
