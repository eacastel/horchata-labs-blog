// middleware.ts
import {NextRequest, NextResponse} from 'next/server';
import createMiddleware from 'next-intl/middleware';

const locales = ['en', 'es'] as const;
const defaultLocale = 'en';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

function geoGuess(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country')?.toUpperCase();
  const esCountries = ['ES','MX','AR','CO','CL','PE','UY','BO','EC','PY','VE','GT','SV','HN','NI','CR','PA','DO','PR'];
  return country && esCountries.includes(country) ? 'es' : defaultLocale;
}

export default function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // If already /en/... or /es/... let next-intl handle it
  const seg = pathname.split('/')[1];
  if ((locales as readonly string[]).includes(seg as any)) {
    return intlMiddleware(req);
  }

  // Otherwise, add locale prefix once (cookie or geo)
  const cookieLocale = req.cookies.get('hl_lang')?.value;
  const chosen =
    cookieLocale && (locales as readonly string[]).includes(cookieLocale as any)
      ? cookieLocale
      : geoGuess(req);

  const url = req.nextUrl.clone();
  url.pathname = `/${chosen}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|api).*)']
};
