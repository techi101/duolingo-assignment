import Link from "next/link";
import Image from "next/image";
import { InfinityIcon, Flame } from "lucide-react";
import { Course } from "@/db/queries";

type Props = {
  activeCourse: Course;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
  streak?: number;
};

export const UserProgress = ({
  activeCourse,
  points,
  hearts,
  hasActiveSubscription,
  streak = 7,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full mb-1">
      {/* Active Course Flag */}
      <Link href="/courses">
        <div className="flex items-center gap-x-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 relative rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm">
            <Image
              src={activeCourse.imageSrc}
              alt={activeCourse.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Link>

      {/* Streak */}
      <Link href="/quests">
        <div className="flex items-center gap-x-1 group cursor-pointer hover:opacity-80 transition-opacity">
          <Flame className="h-6 w-6 text-[#FF9600] fill-[#FF9600] group-hover:scale-110 transition-transform" />
          <span className="font-black text-[#FF9600] text-base tabular-nums">{streak}</span>
        </div>
      </Link>

      {/* Gems */}
      <Link href="/shop">
        <div className="flex items-center gap-x-1 group cursor-pointer hover:opacity-80 transition-opacity">
          <Image src="/gem.svg" height={28} width={28} alt="Gems" className="group-hover:scale-110 transition-transform" />
          <span className="font-black text-[#1CB0F6] text-base tabular-nums">{points}</span>
        </div>
      </Link>

      {/* Hearts */}
      <Link href="/shop">
        <div className="flex items-center gap-x-1 group cursor-pointer hover:opacity-80 transition-opacity">
          <Image src="/heart.svg" height={24} width={24} alt="Hearts" className="group-hover:scale-110 transition-transform" />
          <span className={`font-black text-base tabular-nums ${hearts <= 1 ? "text-[#FF4B4B]" : "text-[#FF4B4B]"}`}>
            {hasActiveSubscription
              ? <InfinityIcon className="h-5 w-5 stroke-[3]" />
              : hearts}
          </span>
        </div>
      </Link>
    </div>
  );
};
