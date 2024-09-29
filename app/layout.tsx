import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.scss";
import LayoutPage from "./components/layout-page";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./components/theme-provider";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });

// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Tieu Phuong Crochet",
//   description: "The place collects free chart",
// };

export async function generateMetadata() {
// here use your way to get translation string
  const t = await getTranslations("App"); 

  return {
      title: {
        template: `%s | ${t("title")}`,
        default: t("title")
      },
      description: t("description")
  }
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

  console.log('locale', locale);
  console.log('messages', messages);
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <AntdRegistry>
              <LayoutPage>
                {children}
              </LayoutPage>
            </AntdRegistry>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
