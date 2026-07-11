import Image from "next/image";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  id: number;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  active?: boolean;
};

export const Card = ({
  title,
  id,
  imageSrc,
  disabled,
  onClick,
  active,
}: Props) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[200px] w-full max-w-[200px] dark:border-slate-800",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="min-[24px] w-full flex items-center justify-end">
        {active && (
          <div className="rounded-md bg-green-600 flex items-center justify-center p-1.5">
            <Check className="text-white stroke-[4] h-4 w-4" />
          </div>
        )}
      </div>
      <Image
        src={imageSrc}
        alt={title}
        height={70}
        width={93.33}
        className="rounded-lg drop-shadow-md border border-gray-200 dark:border-slate-700 object-cover"
      />
      <p className="text-neutral-700 dark:text-neutral-300 text-center font-bold mt-3">
        {title}
      </p>
    </div>
  );
};
