// DashboardLayout.tsx
import SideNav from "./side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className="flex h-full">
      <SideNav />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>

  );
}