import FeedbackButton from "@/components/feedback";
import SideNav from "./side-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-70px)]">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}
