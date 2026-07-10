"use client";

import Link from "next/link";
import { Check, Crown, Star, Lock } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { cn } from "@/lib/utils";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
}: Props) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  // Zigzag pattern matching real Duolingo
  let indentationLevel: number;
  if (cycleIndex <= 2)      indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else                       indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;
  const isFirst       = index === 0;
  const isLast        = index === totalCount;
  const isCompleted   = !current && !locked;

  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  return (
    <Link
      href={href}
      aria-disabled={locked}
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          /* ── Current lesson — shows progress ring + "Start" bubble ── */
          <div className="h-[102px] w-[102px] relative">
            {/* "Start" speech bubble */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10
                            px-3 py-1.5 bg-white border-2 border-[#58CC02] rounded-xl
                            text-[#58CC02] font-black text-xs uppercase tracking-wider
                            shadow-[0_2px_0_rgba(70,163,2,0.3)]
                            animate-bounce-gentle whitespace-nowrap">
              Start
              {/* Arrow */}
              <div className="absolute left-1/2 -bottom-[9px] -translate-x-1/2
                              w-0 h-0 border-x-[6px] border-x-transparent
                              border-t-[8px] border-t-[#58CC02]" />
            </div>

            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path:  { stroke: "#58CC02", strokeLinecap: "round" },
                trail: { stroke: "#E5E7EB" },
              }}
            >
              {/* Inner button */}
              <div className={cn(
                "w-[68px] h-[68px] rounded-full flex items-center justify-center",
                "shadow-[0_4px_0_rgba(0,0,0,0.15)] border-4 border-white",
                "bg-[#58CC02] hover:bg-[#61DC03] transition-colors",
                "group-hover:scale-105",
              )}>
                <Star className="h-8 w-8 fill-white text-white" />
              </div>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          /* ── Normal lesson button ── */
          <div className={cn(
            "w-[68px] h-[68px] rounded-full flex items-center justify-center",
            "transition-all duration-150 hover:scale-105 active:scale-95",
            "border-4 border-white",
            isCompleted
              ? "bg-[#58CC02] shadow-[0_4px_0_#46A302]"
              : locked
              ? "bg-[#AFAFAF] shadow-[0_4px_0_#8a8a8a]"
              : "bg-[#58CC02] shadow-[0_4px_0_#46A302]",
          )}>
            {isCompleted ? (
              <Check className="h-9 w-9 text-white stroke-[3]" />
            ) : locked ? (
              <Lock className="h-7 w-7 text-white fill-white" />
            ) : isLast ? (
              <Crown className="h-8 w-8 text-white fill-white" />
            ) : (
              <Star className="h-8 w-8 text-white fill-white" />
            )}
          </div>
        )}
      </div>
    </Link>
  );
};
