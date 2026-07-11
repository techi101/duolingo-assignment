import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { getUnits, getLesson, getUserProgress, getUserSubscription } from "@/db/queries";
import { Promo } from "@/components/promo";
import { PromoLeaderboard } from "@/components/promo-leaderboard";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { GuidebookClient } from "./client";

export default async function GuidebookPage({
  params,
}: {
  params: { unitId: string };
}) {
  const unitId = Number(params.unitId);
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const unitsData = getUnits();

  const [userProgress, userSubscription, units] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    unitsData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const unit = units.find((u) => u.id === unitId);
  if (!unit) {
    redirect("/learn");
  }

  // Fetch all lessons for this unit to extract key phrases
  const lessonPromises = unit.lessons.map((l) => getLesson(l.id));
  const lessons = await Promise.all(lessonPromises);

  const keyPhrases: { phrase: string; translation: string; audioSrc: string | null }[] = [];
  const seenPhrases = new Set<string>();

  for (const lesson of lessons) {
    if (!lesson) continue;
    for (const challenge of lesson.challenges) {
      if (challenge.type === "ASSIST" || challenge.type === "SELECT") {
        const correctOption = challenge.challengeOptions.find((o) => o.correct);
        if (correctOption) {
          if (!seenPhrases.has(correctOption.text)) {
            keyPhrases.push({
              phrase: correctOption.text,
              translation: challenge.question,
              audioSrc: correctOption.audioSrc,
            });
            seenPhrases.add(correctOption.text);
          }
        }
      }
    }
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        {!isPro && <Promo />}
        <PromoLeaderboard />
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <div className="w-full flex-1 mb-10">
        <div className="flex items-center mb-6">
          <Link href="/learn" className="flex items-center text-[#AFAFAF] hover:text-neutral-600 font-bold uppercase tracking-widest text-sm transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2 stroke-[3]" />
            Back
          </Link>
        </div>

        <div className="flex items-center gap-6 mb-10">
          <div className="bg-gray-100 rounded-full p-4 flex-shrink-0">
            <Image src="/mascot.svg" alt="Mascot" width={80} height={80} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-800 mb-2">
              Unit {unit.order} Guidebook
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Explore grammar tips and key phrases for this unit
            </p>
          </div>
        </div>

        {keyPhrases.length > 0 && (
          <div className="mt-8">
            <h2 className="text-[#1CB0F6] font-bold text-lg uppercase tracking-widest mb-6">
              Key Phrases
            </h2>
            <GuidebookClient 
              phrases={keyPhrases} 
              activeCourseTitle={userProgress.activeCourse.title}
            />
          </div>
        )}
      </div>
    </div>
  );
}
