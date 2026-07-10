import { redirect } from "next/navigation";
import Image from "next/image";
import { getUserProfile } from "@/db/queries";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ProfileStats } from "./profile-stats";
import { AchievementBadge } from "./achievement-badge";

const ProfilePage = async () => {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      {/* Sticky right panel */}
      <StickyWrapper>
        <div className="rounded-2xl border-2 border-gray-100 p-4 space-y-4">
          <h3 className="font-black text-neutral-700 text-center text-sm uppercase tracking-wider">
            Quick Stats
          </h3>
          <Separator />
          <ProfileStats
            streak={profile.streak}
            xp={profile.xp}
            hearts={profile.hearts}
            completedLessons={profile.completedLessons}
            earnedAchievements={profile.earnedAchievements}
            totalAchievements={profile.achievements.length}
          />
        </div>
      </StickyWrapper>

      {/* Main feed */}
      <FeedWrapper>
        {/* Hero card */}
        <div className="w-full rounded-3xl p-8 mb-8 bg-gradient-to-br from-[#58CC02] to-[#46A302] text-white shadow-lg">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 ring-4 ring-white/40 flex items-center justify-center text-4xl font-black shadow-inner">
                {profile.username[0].toUpperCase()}
              </div>
              {/* Streak flame */}
              {profile.streak > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-orange-400 rounded-full px-2 py-0.5 text-xs font-black text-white border-2 border-white">
                  🔥{profile.streak}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black">{profile.username}</h1>
              <p className="text-white/80 font-semibold">
                {profile.activeCourse?.title ?? "No course"} learner
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="bg-white/20 rounded-full px-3 py-0.5 text-sm font-bold">
                  ⚡ {profile.xp} XP
                </span>
                <span className="bg-white/20 rounded-full px-3 py-0.5 text-sm font-bold">
                  🔥 {profile.streak} day streak
                </span>
                <span className="bg-white/20 rounded-full px-3 py-0.5 text-sm font-bold">
                  ❤️ {profile.hearts}/5 hearts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress section */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-neutral-700 mb-4">Learning Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border-2 border-gray-100 p-5 hover:border-[#58CC02]/30 transition-colors">
              <p className="text-3xl font-black text-[#58CC02]">{profile.xp}</p>
              <p className="text-sm font-bold text-neutral-500 mt-1">Total XP Earned</p>
            </div>
            <div className="rounded-2xl border-2 border-gray-100 p-5 hover:border-orange-300 transition-colors">
              <p className="text-3xl font-black text-orange-500">{profile.streak}</p>
              <p className="text-sm font-bold text-neutral-500 mt-1">Day Streak 🔥</p>
            </div>
            <div className="rounded-2xl border-2 border-gray-100 p-5 hover:border-sky-300 transition-colors">
              <p className="text-3xl font-black text-sky-500">{profile.completedLessons}</p>
              <p className="text-sm font-bold text-neutral-500 mt-1">Lessons Completed</p>
            </div>
          </div>
        </div>

        {/* XP toward next milestone */}
        <div className="mb-8 rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-black text-neutral-700 mb-4">XP Progress</h2>
          {[
            { label: "50 XP",   threshold: 50 },
            { label: "100 XP",  threshold: 100 },
            { label: "500 XP",  threshold: 500 },
            { label: "1000 XP", threshold: 1000 },
          ].map(({ label, threshold }) => {
            const pct = Math.min((profile.xp / threshold) * 100, 100);
            return (
              <div key={label} className="mb-4 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-neutral-600">{label}</span>
                  <span className="text-sm font-bold text-[#58CC02]">
                    {Math.min(profile.xp, threshold)}/{threshold}
                  </span>
                </div>
                <Progress value={pct} className="h-3" />
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-neutral-700">Achievements</h2>
            <span className="text-sm font-bold text-[#58CC02] bg-[#58CC02]/10 rounded-full px-3 py-1">
              {profile.earnedAchievements}/{profile.achievements.length} earned
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.achievements.map((ach) => (
              <AchievementBadge key={ach.id} achievement={ach} />
            ))}
          </div>
        </div>

        {/* Stats table */}
        <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-100">
                <th className="text-left px-6 py-3 text-sm font-black text-neutral-600 uppercase tracking-wider">
                  Stat
                </th>
                <th className="text-right px-6 py-3 text-sm font-black text-neutral-600 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Total XP",              value: `${profile.xp} XP` },
                { label: "Current Streak",         value: `🔥 ${profile.streak} days` },
                { label: "Hearts Remaining",       value: `❤️ ${profile.hearts}/5` },
                { label: "Lessons Completed",      value: profile.completedLessons },
                { label: "Challenges Completed",   value: profile.completedChallenges },
                { label: "Achievements Earned",    value: `🏅 ${profile.earnedAchievements}` },
                { label: "Active Course",          value: profile.activeCourse?.title ?? "–" },
                { label: "Last Active",            value: profile.lastActiveDate ?? "Today" },
              ].map(({ label, value }) => (
                <tr key={label} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-6 py-3 font-semibold text-neutral-600">{label}</td>
                  <td className="px-6 py-3 font-black text-neutral-800 text-right">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ProfilePage;
