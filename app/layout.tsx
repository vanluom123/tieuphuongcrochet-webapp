import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.scss";
import LayoutPage from "./components/layout-page";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./components/theme-provider";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import AuthProvider from "./context/AuthProvider";

export async function generateMetadata() {
  const t = await getTranslations("App");

  return {
    title: {
      template: `%s | ${t("title")}`,
      default: t("title"),
    },
    description: t("description"),
    // Add the following SEO-related metadata
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: "en_US",
      siteName: t("title"),
      
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/opengraph-image.jpg",
    },
    viewport: "width=device-width, initial-scale=1",
    charSet: "utf-8",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider>
              <AntdRegistry>
                <LayoutPage>
                  {children}
                </LayoutPage>
              </AntdRegistry>
            </ThemeProvider>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
