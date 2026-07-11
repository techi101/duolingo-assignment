import { redirect } from "next/navigation";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { UserProgress } from "@/components/user-progress";
import { Promo } from "@/components/promo";
import { PromoLeaderboard } from "@/components/promo-leaderboard";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { SettingsClient } from "./client";

const SettingsPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
        <PromoLeaderboard />
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <div className="w-full flex-1 mb-10">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Settings</h1>
        <SettingsClient />
      </div>
    </div>
  );
};

export default SettingsPage;
