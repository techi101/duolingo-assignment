import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Promo = () => {
  return (
    <div className="border-2 dark:border-slate-800 rounded-xl p-6 relative overflow-hidden">
      <div className="flex flex-col gap-y-4">
        <div className="w-full flex justify-between items-start">
          <div className="space-y-2 z-10 w-[60%]">
            <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">
              Try Super for free
            </h3>
            <p className="text-muted-foreground text-sm font-semibold leading-snug">
              No ads, personalized practice, and unlimited Legendary!
            </p>
          </div>
          <Image
            src="/mascot.svg"
            alt="Pro"
            height={70}
            width={70}
            className="z-0 absolute -right-2 top-4 drop-shadow-sm opacity-90"
          />
        </div>
        <Button
          asChild
          className="w-full bg-[#1CB0F6] hover:bg-[#1899D6] border-[#1899D6] text-white font-black tracking-widest uppercase border-b-4 active:border-b-0 mt-2"
          size="lg"
        >
          <Link href="/shop">
            Try 1 Week Free
          </Link>
        </Button>
      </div>
    </div>
  );
};
