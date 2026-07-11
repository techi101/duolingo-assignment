import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({
  children,
}: Props) => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <MobileHeader />
      <div className="hidden lg:flex lg:w-[256px] lg:fixed lg:left-0 lg:top-0 lg:h-full">
        <Sidebar />
      </div>
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className="max-w-[1056px] mx-auto pt-6 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
 
export default MainLayout;
