"use client";

import { useConvexAuth } from "convex/react";
import SideNav from "./side-nav";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-70px)]">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}
