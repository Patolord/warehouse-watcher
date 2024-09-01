import { Boxes, Earth, Home, Sparkles, Warehouse } from "lucide-react";
import { usePathname } from "next/navigation";

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string | null, nav: string) {
    return pathname?.includes(nav) ?? false;
  }

  return [
    {
      name: "Dashboard",
      href: "/",
      icon: <Home size={20} />,
      active: pathname === "/",
      position: "top",
    },

    {
      name: "Estoques",
      href: "/dashboard/warehouses",
      icon: <Warehouse size={20} />,
      active: isNavItemActive(pathname, "warehouses"),
      position: "top",
    },
    {
      name: "Materiais",
      href: "/dashboard/materials",
      icon: <Boxes size={20} />,
      active: isNavItemActive(pathname, "materials"),
      position: "top",
    },
    {
      name: "World Map",
      href: "/dashboard/worldmap",
      icon: <Earth size={20} color="#0000ff" />,
      active: isNavItemActive(pathname, "worldmap"),
      position: "top",
    },
    {
      name: "Chat",
      href: "/dashboard/chat",
      icon: <Sparkles size={20} color="#800080" />,
      active: isNavItemActive(pathname, "chat"),
      position: "top",
    },
  ];
};
