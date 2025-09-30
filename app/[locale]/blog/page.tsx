import { getTranslations } from "next-intl/server";
import { listPosts } from "../../../lib/contentful";
import Link from "next/link";

export const revalidate = 60;

export default async function BlogIndex({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale });
  const posts = await listPosts(params.locale);
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">{t("blog.title")}</h1>
      <ul className="space-y-6">
        {posts.map((p) => (
          <li
            key={p.slug}
            className="border p-4 rounded hover:border-brand/70 transition"
          >
            <Link
              href={`/${params.locale}/blog/${p.slug}`}
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
