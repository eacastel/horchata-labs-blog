// app/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

const SUPPORTED = ['en', 'es'] as const;

export default getRequestConfig(async ({locale}) => {
  // next-intl v3 still provides `locale` here (deprecation warning is OK)
  const safe = (SUPPORTED as readonly string[]).includes(locale as any) ? locale : 'en';
  return {
    // Returning locale silences the other warning and keeps things future-proof enough
    locale: safe,
    messages: (await import(`../../messages/${safe}.json`)).default
  };
});
