import "./globals.css";
import FeedbackButton from "@/components/feedback";

import Header from "./header";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import TailwindIndicator from "@/components/tailwind-indicator";
import { Inter } from "next/font/google";
import { Metadata } from "next";

import { Toaster } from "@/components/ui/toaster";
import { ConvexClientProvider } from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Warehouse Watcher",
  description:
    "Warehouse Watcher offers simple, hassle-free inventory control without the need for complex ERP systems.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <ConvexClientProvider>
            <NextTopLoader />

            <Header />
            {children}
            <FeedbackButton />

            <Toaster />

            <TailwindIndicator />
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
