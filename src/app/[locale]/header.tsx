'use client'

import { useState, useEffect } from "react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { Menu } from "lucide-react";
import WarehouseWatcherLogo from "@/components/logo";
import { SignOutButton } from "@/auth/SignOut";
import { LanguageSwitcher } from "../language-switcher";
import { NavItems } from "@/config";
import { api } from "../../../convex/_generated/api";
import { SignInButton } from "@/auth/SignInButton";
import { useQuery } from "convex/react";

export default function Header() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const viewer = useQuery(api.users.viewer);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navItems = NavItems();

  useEffect(() => {
    if (isLoading) {
      setIsTransitioning(true);
    } else {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="flex items-center h-[70px] px-4 border-b shrink-0 md:px-10 justify-between bg-slate-100 dark:bg-slate-900">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
        prefetch={false}
      >
        <WarehouseWatcherLogo />
      </Link>
      <div className="ml-4 flex items-center gap-3">
        {isTransitioning ? (
          <span>Loading...</span>
        ) : isAuthenticated ? (
          <>
            {viewer && <span className="hidden md:inline">{viewer.email}</span>}
            <SignOutButton />
            <button onClick={toggleNav} className="md:hidden">
              <Menu size={24} />
            </button>
          </>
        ) : (
          <>
            <LanguageSwitcher />
            <SignInButton />
          </>
        )}
      </div>
      {isNavOpen && isAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 left-0 bg-white dark:bg-slate-800 h-full shadow-lg p-5">
            <ul className="space-y-4">
              {navItems.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="flex flex-row items-center gap-2 hover:text-slate-400"
                    onClick={toggleNav}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}