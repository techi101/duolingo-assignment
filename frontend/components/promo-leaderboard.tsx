import { Lock } from "lucide-react";

export const PromoLeaderboard = () => {
  return (
    <div className="border-2 dark:border-slate-800 rounded-xl p-6">
      <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200 mb-4">
        Unlock Leaderboards!
      </h3>
      <div className="flex items-center gap-x-4">
        <div className="bg-gray-200 dark:bg-slate-700 rounded-2xl p-3">
          <Lock className="w-8 h-8 text-gray-400 dark:text-slate-400" />
        </div>
        <p className="text-muted-foreground dark:text-neutral-400 text-sm font-semibold leading-snug">
          Complete 2 more lessons to start competing
        </p>
      </div>
    </div>
  );
};

