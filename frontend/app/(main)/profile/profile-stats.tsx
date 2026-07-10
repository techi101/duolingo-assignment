import { Flame, Star, Heart, BookOpen, Trophy } from "lucide-react";

type Props = {
  streak: number;
  xp: number;
  hearts: number;
  completedLessons: number;
  earnedAchievements: number;
  totalAchievements: number;
};

export const ProfileStats = ({
  streak, xp, hearts, completedLessons, earnedAchievements, totalAchievements
}: Props) => {
  const stats = [
    { label: "Streak",       value: `${streak}d`,   icon: Flame,    color: "text-orange-500" },
    { label: "XP",           value: xp,             icon: Star,     color: "text-yellow-500" },
    { label: "Hearts",       value: `${hearts}/5`,  icon: Heart,    color: "text-rose-500" },
    { label: "Lessons",      value: completedLessons,icon: BookOpen, color: "text-sky-500" },
    { label: "Achievements", value: `${earnedAchievements}/${totalAchievements}`, icon: Trophy, color: "text-[#58CC02]" },
  ];

  return (
    <div className="space-y-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-sm font-bold text-neutral-600">{label}</span>
          </div>
          <span className="text-sm font-black text-neutral-800">{value}</span>
        </div>
      ))}
    </div>
  );
};
