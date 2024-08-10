import { Boxes, Home, Warehouse } from "lucide-react";
import { usePathname } from "next/navigation";

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
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
  ];
};
