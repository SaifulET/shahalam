
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes"; // new
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import AuthInit from "@/component/Provider/AuthInit";
import GlobalLanguageSwitcher from "@/component/i18n/GlobalLanguageSwitcher";
import {
  DEFAULT_LOCALE,
  getLocaleDirection,
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
} from "@/lib/i18n";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Shahalam",
  description: "Real estate project management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const dir = getLocaleDirection(locale);
  const messages =
    locale === "ar"
      ? (await import("@/messages/ar.json")).default
      : (await import("@/messages/en.json")).default;

  return (
    <html lang={locale} dir={dir} className={poppins.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* ThemeProvider wraps the app */}
        <ThemeProvider attribute="class" defaultTheme="system">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthInit />
            <GlobalLanguageSwitcher />
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
