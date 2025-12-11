// app/i18n/request.ts
import { getRequestConfig } from "next-intl/server";

const SUPPORTED = ["en", "es"] as const;
const DEFAULT_LOCALE = "en";

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is a Promise<string | null>
  let locale = await requestLocale;

  if (!locale || !(SUPPORTED as readonly string[]).includes(locale as any)) {
    locale = DEFAULT_LOCALE;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
