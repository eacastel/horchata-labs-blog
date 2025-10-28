'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LanguageSwitch({ locale }: { locale: string }) {
  const pathname = usePathname();         // e.g., /en/blog/my-post
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const nextLocale = locale === 'en' ? 'es' : 'en';

  async function handleClick() {
    // If we're on a blog post with a slug, resolve its alternate slug
    const m = pathname.match(/^\/(en|es)\/blog\/([^/]+)\/?$/);
    if (m) {
      const currentSlug = m[2];
      setLoading(true);
      try {
        const res = await fetch(
          `/api/alt-slug?slug=${encodeURIComponent(currentSlug)}&from=${locale}&to=${nextLocale}`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        const toSlug = data?.slug || currentSlug; // fallback to same slug if no translation
        router.push(`/${nextLocale}/blog/${toSlug}`);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Otherwise, just swap the locale prefix and keep the rest of the path
    const target = pathname.replace(/^\/(en|es)(\/|$)/, `/${nextLocale}$2`);
    router.push(target);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-2 py-1 border rounded
                 border-neutral-300 text-neutral-800
                 dark:border-neutral-700 dark:text-neutral-100
                 hover:bg-brand hover:text-neutral-900"
      aria-label={`Switch to ${nextLocale.toUpperCase()}`}
    >
      {loading ? '…' : nextLocale.toUpperCase()}
    </button>
  );
}
