import { MobileSidebar } from "./mobile-sidebar";

export const MobileHeader = () => {
  return (
    <nav className="lg:hidden px-6 h-[50px] flex items-center bg-[#58CC02] dark:bg-slate-900 border-b fixed top-0 w-full z-50 dark:border-slate-800">
      <MobileSidebar />
    </nav>
  );
};
