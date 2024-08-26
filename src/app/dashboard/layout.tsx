import FeedbackButton from "@/components/feedback";
import SideNav from "./side-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SideNav />
      <div className="w-full overflow-x-auto">
        <div className="sm:h-[calc(99vh-70px)] overflow-auto">
          <div className="w-full flex justify-center mx-auto overflow-auto h-[calc(100vh-120px)] relative">
            <div className="w-full md:max-w-6xl px-4 py-4">
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        <FeedbackButton />
      </div>
    </div>
  );
}