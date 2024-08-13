"use client";

import { Button } from "@/components/ui/button";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { SignOut } from "../auth/SignOut";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { SignInFormPassword } from "@/auth/SignInFormPassword";
import { Atom } from "lucide-react";
import WarehouseWatcherLogo from "@/components/logo";

export default function Header() {
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Login</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign in or create an account</DialogTitle>
                  <DialogDescription>
                    <SignInFormPassword />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </Unauthenticated>
          <Authenticated>
            <div className="flex items-center gap-8">
              <SignOut />
            </div>
          </Authenticated>

        </div>
      </div>
    </div>
  );
}
