"use client";

import { useState } from "react";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import WarehouseWatcherLogo from "@/components/logo";
import { SignInDialog } from "@/auth/SignInDialog";
import { SignOutButton } from "@/auth/SignOut";
import { api } from "../../convex/_generated/api";
import { NavItems } from "@/config";

export default function Header() {
  const viewer = useQuery(api.users.viewer, {});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = NavItems();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="z-10 relative dark:bg-slate-900 bg-slate-100 py-4 border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <WarehouseWatcherLogo />
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">


            <AuthLoading>Carregando...</AuthLoading>
            <Unauthenticated>
              <SignInDialog />
            </Unauthenticated>
            <Authenticated>
              <div className="flex items-center gap-4">
                {viewer ? <p>{viewer.email}</p> : ""}
                <SignOutButton />
              </div>
            </Authenticated>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <Authenticated>
              <nav className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="hover:text-slate-400 py-2"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </Authenticated>

            <div className="mt-4">
              <AuthLoading>Carregando...</AuthLoading>
              <Unauthenticated>
                <SignInDialog />
              </Unauthenticated>
              <Authenticated>
                <div className="flex flex-col gap-2">
                  {viewer ? <p>{viewer.email}</p> : ""}
                  <SignOutButton />
                </div>
              </Authenticated>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}