"use client";

import { cn } from "@/lib/utils";
import { ClipboardPen, Cog, FilesIcon, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="space-y-6 ">
        <li>
          <Link
            className={cn(
              "font-light flex gap-2 items-center text-xl hover:text-cyan-400 dark:hover:text-cyan-100",
              {
                "text-cyan-300": pathname.endsWith("/materials"),
              }
            )}
            href="/dashboard/materials"
          >
            <Search />
            Materials
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              "font-light flex gap-2 items-center text-xl hover:text-cyan-400 dark:hover:text-cyan-100",
              {
                "text-cyan-300": pathname.endsWith("/warehouses"),
              }
            )}
            href="/dashboard/warehouses"
          >
            <FilesIcon />
            Warehouses
          </Link>
        </li>
      </ul>
    </nav>
  );
}
