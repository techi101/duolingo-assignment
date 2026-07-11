import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => {
  return (
    <div className="sticky top-0 bg-white dark:bg-slate-900 pb-3 lg:pt-[28px] lg:mt-[-28px] flex items-center justify-between border-b-2 dark:border-slate-800 mb-5 text-neutral-400 dark:text-neutral-200 lg:z-50">
      <Link href="/courses">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
        </Button>
      </Link>
      <h1 className="font-bold text-lg">
        {title}
      </h1>
      <div />
    </div>
  );
};
