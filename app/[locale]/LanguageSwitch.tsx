'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

export default function LanguageSwitch({locale}: {locale: string}) {
  const pathname = usePathname(); // e.g. /en/blog/my-post
  const nextLocale = locale === 'en' ? 'es' : 'en';

  // Replace /en or /es prefix with the opposite, preserving the rest of the URL
  const target = pathname.replace(/^\/(en|es)(\/|$)/, `/${nextLocale}$2`);

  return (
    <Link
      href={target}
      prefetch={false}
      className="px-2 py-1 border rounded
                 border-neutral-300 text-neutral-800
                 dark:border-neutral-700 dark:text-neutral-100
                 hover:bg-brand hover:text-neutral-900"
      aria-label={`Switch to ${nextLocale.toUpperCase()}`}
    >
      {nextLocale.toUpperCase()}
    </Link>
  );
}
