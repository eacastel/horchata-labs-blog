// ==============================
// app/[locale]/blog/[slug]/page.tsx (Post)
// ==============================
import type { Metadata } from "next";
import { getPostBySlug } from "../../../../lib/contentful";
import { postMetadata } from "../../../../lib/seo";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug, params.locale);
  if (!post) return {};
  return postMetadata(post, params.locale);
}

export default async function BlogPost({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const post = await getPostBySlug(params.slug, params.locale);
  if (!post) return <div className="text-neutral-600">Not found</div>;
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>{post.title}</h1>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full rounded"
        />
      )}
      <div className="text-sm text-neutral-500">
        {post.publishedDate?.slice(0, 10)} · {post.authorName}
      </div>
      <div className="mt-6">{documentToReactComponents(post.body)}</div>
    </article>
  );
}
