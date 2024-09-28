import type { Metadata } from "next";
import localFont from "next/font/local";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "./components/theme-prodiver";
import { i18n, type Locale } from "@/i18n.config";
import "./globals.scss";
import LayoutPage from "./components/layout";


export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Tieu Phuong Crochet",
  description: "The place collects free chart",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  return (
    <html lang={params.lang}>
      <body>
        <ThemeProvider>
          <AntdRegistry>
            <LayoutPage>
              {children}
            </LayoutPage>
          </AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
