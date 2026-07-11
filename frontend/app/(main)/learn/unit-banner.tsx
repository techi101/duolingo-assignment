import Link from "next/link";
import { NotebookText } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  unitId: number;
};

export const UnitBanner = ({ title, description, unitId }: Props) => {
  return (
    <div className="w-full rounded-3xl p-6 text-white flex items-center justify-between
                    shadow-[0_4px_0_rgba(0,0,0,0.15)]"
         style={{ background: "linear-gradient(135deg, #58CC02 0%, #46A302 100%)" }}>
      <div className="space-y-1">
        <h3 className="text-white/80 text-sm font-bold uppercase tracking-widest flex items-center">
          <Link href="/sections" className="hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            SECTION 1, {title.toUpperCase()}
          </Link>
        </h3>
        <h3 className="text-2xl font-black">
          {description}
        </h3>
      </div>
      <Link href={`/guidebook/${unitId}`}>
        <Button
          size="lg"
          className="hidden xl:flex bg-transparent border-2 border-white/30 text-white hover:bg-white/10
                     font-black uppercase tracking-wider active:border-white/20 active:mt-1
                     rounded-xl shadow-none"
        >
          <NotebookText className="mr-2 h-5 w-5" />
          Guidebook
        </Button>
      </Link>
    </div>
  );
};
