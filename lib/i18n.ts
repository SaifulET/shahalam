export const LOCALE_COOKIE_NAME = "app-locale";

export const SUPPORTED_LOCALES = ["en", "ar"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

export function isSupportedLocale(value: string | undefined | null): value is AppLocale {
  return !!value && SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function getLocaleDirection(locale: AppLocale) {
  return locale === "ar" ? "rtl" : "ltr";
}
