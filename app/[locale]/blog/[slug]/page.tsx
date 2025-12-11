// app/[locale]/blog/[slug]/page.tsx (Post)

import type { Metadata } from "next";
import { getPostBySlug } from "@lib/contentful";
import { postMetadata } from "../../../../lib/seo";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export const revalidate = 60;

// If you want, you can keep a loose type just for yourself:
type BlogPageParams = {
  locale: string;
  slug: string;
};

export async function generateMetadata(
  { params }: { params: BlogPageParams } | any
): Promise<Metadata> {
  // If Next ever starts passing a Promise here, this still works:
  const resolvedParams =
    typeof (params as any)?.then === "function" ? await params : params;

  const post = await getPostBySlug(
    resolvedParams.slug,
    resolvedParams.locale
  );
  if (!post) return {};
  return postMetadata(post, resolvedParams.locale);
}

export default async function BlogPost(
  { params }: { params: BlogPageParams } | any
) {
  const resolvedParams =
    typeof (params as any)?.then === "function" ? await params : params;

  const post = await getPostBySlug(
    resolvedParams.slug,
    resolvedParams.locale
  );
  if (!post) {
    return <div className="text-neutral-600">Not found</div>;
  }

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
