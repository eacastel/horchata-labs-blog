// app/[locale]/blog/page.tsx

import { getTranslations } from "next-intl/server";
import { listPosts } from "@lib/contentful";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

// (Optional) If you ever want metadata here, you can add:
// export async function generateMetadata(
//   { params }: { params: { locale: string } } | any
// ): Promise<Metadata> {
//   const resolvedParams =
//     typeof (params as any)?.then === "function" ? await params : params;
//   const locale = resolvedParams.locale as string;
//   const t = await getTranslations({ locale });
//   return {
//     title: t("blog.title"),
//   };
// }

export default async function BlogIndex(
  { params }: { params: { locale: string } } | any
) {
  // Normalize params in case Next passes it as a Promise-like
  const resolvedParams =
    typeof (params as any)?.then === "function" ? await params : params;

  const locale = resolvedParams.locale as string;

  const t = await getTranslations({ locale });
  const posts = await listPosts(locale);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
        {t("blog.title")}
      </h1>
      <ul className="space-y-6">
        {posts.map((p) => (
          <li
            key={p.slug}
            className="border p-4 rounded hover:border-brand/70 transition"
          >
            <Link
              href={`/${locale}/blog/${p.slug}`}
              className="text-xl font-semibold hover:text-brand"
            >
              {p.title}
            </Link>
            <p className="text-sm text-neutral-600 mt-2">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
