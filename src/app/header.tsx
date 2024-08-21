"use client";

import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";



import Link from "next/link";

import WarehouseWatcherLogo from "@/components/logo";
import { SignInDialog } from "@/auth/SignInDialog";
import { SignOutButton } from "@/auth/SignOut";
import { api } from "../../convex/_generated/api";



export default function Header() {

  const viewer = useQuery(api.users.viewer, {});
  return (
    <div className="z-10 relative dark:bg-slate-900 bg-slate-100 py-4 border">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-12 items-center">
          <Link href="/">
            <WarehouseWatcherLogo />
          </Link>
          <Authenticated>
            <nav>
              <Link href="/dashboard/materials" className="hover:text-slate-400">

              </Link>

            </nav>
          </Authenticated>
        </div>

        <div className="flex items-center gap-8">
          <AuthLoading>Carregando...</AuthLoading>
          <Unauthenticated>
            <SignInDialog />
          </Unauthenticated>
          <Authenticated>

            <div className="flex items-center gap-8">
              {viewer ? (
                <p>{viewer.email}</p>) : ""}
              <SignOutButton />
            </div>
          </Authenticated>

        </div>
      </div>
    </div>
  );
}
