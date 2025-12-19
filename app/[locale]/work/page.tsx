import { getSiteContent } from "../../../lib/getSiteContent";

const placeholderWork = [
  { title: "Continuity Recovery", desc: "Stabilized systems after a failed handoff and restored reliability." },
  { title: "Tracking Integrity", desc: "Fixed broken conversions and rebuilt trustworthy measurement." },
  { title: "Performance + SEO Repair", desc: "Resolved technical issues impacting visibility and speed." },
];

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = await getSiteContent(locale);

  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Work</h1>
        <p className="text-neutral-700 dark:text-neutral-200">
          Representative examples (placeholders for now).
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {placeholderWork.map((w) => (
          <div
            key={w.title}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-950"
          >
            <h2 className="text-xl font-semibold">{w.title}</h2>
            <p className="mt-2 text-neutral-700 dark:text-neutral-200">{w.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-950">
        <h2 className="text-xl font-semibold">{c.proof.title}</h2>
        <ul className="mt-3 list-disc pl-5 text-neutral-700 dark:text-neutral-200">
          {c.proof.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        {c.proof.note && (
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            {c.proof.note}
          </p>
        )}
      </div>
    </section>
  );
}
