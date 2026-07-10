import Link from "next/link";
import { NotebookText } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
};

export const UnitBanner = ({ title, description }: Props) => {
  return (
    <div className="w-full rounded-3xl p-6 text-white flex items-center justify-between
                    shadow-[0_4px_0_rgba(0,0,0,0.15)]"
         style={{ background: "linear-gradient(135deg, #58CC02 0%, #46A302 100%)" }}>
      <div className="space-y-1">
        <p className="text-white/80 text-sm font-bold uppercase tracking-widest">
          Section
        </p>
        <h3 className="text-2xl font-black">
          {title}
        </h3>
        <p className="text-white/90 font-semibold text-sm">
          {description}
        </p>
      </div>
      <Link href="/lesson">
        <Button
          size="lg"
          className="hidden xl:flex bg-white text-[#58CC02] border-b-4 border-[#46A302]
                     font-black uppercase tracking-wider hover:bg-gray-50
                     active:border-b-0 active:mt-1"
        >
          <NotebookText className="mr-2 h-5 w-5" />
          Continue
        </Button>
      </Link>
    </div>
  );
};
