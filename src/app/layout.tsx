import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Header from "./header";
import NextTopLoader from 'nextjs-toploader';
import TailwindIndicator from "@/components/tailwind-indicator";

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
      <html lang='en'>
        <body className={`${inter.className}`}>
          <ConvexClientProvider>
            <NextTopLoader />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              {children}
              <TailwindIndicator />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}