import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Header from "./header";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Warehouse Watcher",
  description: "Warehouse Watcher offers simple, hassle-free inventory control without the need for complex ERP systems.",
};

export default async function RootLayout({
  children,

}: Readonly<{
  children: React.ReactNode;

}>) {

  return (
    <ConvexAuthNextjsServerProvider>
      <html lang='en' className="h-full">
        <body className={`${inter.className} flex flex-col h-full`}>
          <ConvexClientProvider>
            <NextTopLoader />


            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </ThemeProvider>

          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}