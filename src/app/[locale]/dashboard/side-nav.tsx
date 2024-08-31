"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavItems } from "@/config";
import { cn } from "@/lib/utils";

export default function SideNav() {
  const navItems = NavItems();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("sidebarExpanded");
    if (saved !== null) {
      setIsSidebarExpanded(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "sidebarExpanded",
      JSON.stringify(isSidebarExpanded)
    );
  }, [isSidebarExpanded]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="h-full">
      <div
        className={cn(
          isSidebarExpanded ? "w-[200px]" : "w-[68px]",
          "border-r transition-all duration-300 ease-in-out transform hidden sm:flex h-full bg-background"
        )}
      >
        <aside className="flex flex-col w-full break-words px-2 py-4 overflow-x-hidden h-full">
          <button
            type="button"
            className="self-start p-2 mb-4 rounded-md hover:bg-muted"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>

          <div className="flex flex-col space-y-1">
            {navItems.map((item, idx) => {
              if (item.position === "top") {
                return (
                  <SideNavItem
                    key={idx}
                    label={item.name}
                    icon={item.icon}
                    path={item.href}
                    active={item.active}
                    isSidebarExpanded={isSidebarExpanded}
                  />
                );
              }
            })}
          </div>
          <div className="mt-auto">
            {navItems.map((item, idx) => {
              if (item.position === "bottom") {
                return (
                  <SideNavItem
                    key={idx}
                    label={item.name}
                    icon={item.icon}
                    path={item.href}
                    active={item.active}
                    isSidebarExpanded={isSidebarExpanded}
                  />
                );
              }
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export const SideNavItem: React.FC<{
  label: string;
  icon: any;
  path: string;
  active: boolean;
  isSidebarExpanded: boolean;
}> = ({ label, icon, path, active, isSidebarExpanded }) => {
  return (
    <TooltipProvider delayDuration={70}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={path}
            className={cn(
              "flex items-center rounded-md px-2 py-1.5 text-sm font-medium",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {icon}
            {isSidebarExpanded && <span className="ml-2">{label}</span>}
          </Link>
        </TooltipTrigger>
        {!isSidebarExpanded && (
          <TooltipContent side="right" className="px-2 py-1 text-xs">
            <span>{label}</span>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
