import { cn } from "@/lib/utils";
import { Achievement } from "@/db/queries";

type Props = { achievement: Achievement };

export const AchievementBadge = ({ achievement }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200",
        achievement.earned
          ? "border-[#58CC02]/30 bg-gradient-to-br from-[#58CC02]/5 to-[#58CC02]/10 hover:shadow-md hover:border-[#58CC02]/50"
          : "border-gray-100 bg-gray-50 opacity-50 grayscale",
      )}
    >
      <span className="text-3xl">{achievement.icon}</span>
      <p className="text-xs font-black text-center text-neutral-700 leading-tight">
        {achievement.title}
      </p>
      <p className="text-[10px] font-semibold text-center text-neutral-400 leading-tight">
        {achievement.description}
      </p>
      {achievement.earned && (
        <span className="text-[10px] font-black text-[#58CC02] uppercase tracking-wider">
          Earned ✓
        </span>
      )}
    </div>
  );
};
