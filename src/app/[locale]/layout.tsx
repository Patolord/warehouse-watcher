import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "./header";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "../ConvexClientProvider";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import TailwindIndicator from "@/components/tailwind-indicator";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import FeedbackButton from "@/components/feedback";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Warehouse Watcher",
  description:
    "Warehouse Watcher offers simple, hassle-free inventory control without the need for complex ERP systems.",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <ConvexAuthNextjsServerProvider>
      <html lang={locale}>
        <body className={`${inter.className}`}>
          <ConvexClientProvider>
            <NextTopLoader />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NextIntlClientProvider messages={messages}>
                <Header />
                {children}
                <FeedbackButton />

                <Toaster />
              </NextIntlClientProvider>
              <TailwindIndicator />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
