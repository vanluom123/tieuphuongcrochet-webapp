import { Viewport } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LayoutPage from "./components/layout-page";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./components/theme-provider";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import AuthProvider from "./context/AuthProvider";
import GoogleTag from "./components/GoogleTag";
import "./globals.scss";

export async function generateMetadata() {
  const t = await getTranslations("App");

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.tieuphuongcrochet.com"),
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
      locale: "vi_VN", // Changed to Vietnamese locale
      siteName: t("title"),
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
          width: 1200,
          height: 630,
          alt: t("title"),
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
        }
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/opengraph-image.jpg",
    }
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
      <GoogleTag /> 
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
