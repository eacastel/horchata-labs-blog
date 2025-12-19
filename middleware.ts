// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const locales = ["en", "es"] as const;
const defaultLocale = "en";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

function isAvanti(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase();
  return host.includes("avantiinteractive.com");
}

function geoGuess(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country")?.toUpperCase();
  const esCountries = [
    "ES",
    "MX",
    "AR",
    "CO",
    "CL",
    "PE",
    "UY",
    "BO",
    "EC",
    "PY",
    "VE",
    "GT",
    "SV",
    "HN",
    "NI",
    "CR",
    "PA",
    "DO",
    "PR",
  ];
  return country && esCountries.includes(country) ? "es" : "en";
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals, API, and files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If already /en/... or /es/... let next-intl handle it
  const seg = pathname.split("/")[1];
  if ((locales as readonly string[]).includes(seg as any)) {
    return intlMiddleware(req);
  }

  // Cookie wins if present
  const cookieLocale = req.cookies.get("hl_lang")?.value;
  const cookieOk =
    cookieLocale && (locales as readonly string[]).includes(cookieLocale as any)
      ? cookieLocale
      : null;

  // Brand default behavior
  const chosen = cookieOk ? cookieOk : isAvanti(req) ? "en" : geoGuess(req);

  const url = req.nextUrl.clone();
  url.pathname = `/${chosen}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
