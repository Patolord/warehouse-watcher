import "./globals.css";
import FeedbackButton from "@/components/feedback";
import { Toaster } from "sonner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FeedbackButton />
        <Toaster />
      </body>
    </html>
  );
}
