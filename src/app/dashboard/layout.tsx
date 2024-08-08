import SideNav from "./side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex gap-24 container mx-auto pt-12">
      <SideNav />

      {children}
    </div>
  );
}
