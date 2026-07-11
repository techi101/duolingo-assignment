"use client";

import { toast } from "sonner";
import Image from "next/image";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { useState, useTransition, useCallback } from "react";
import { useAudio, useWindowSize, useMount } from "react-use";

import { cn } from "@/lib/utils";
import { reduceHearts } from "@/actions/user-progress";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { Challenge, ChallengeOption } from "@/db/queries";
import { usePracticeModal } from "@/store/use-practice-modal";
import { upsertChallengeProgress } from "@/actions/challenge-progress";

import { Header } from "./header";
import { Footer } from "./footer";
import { Challenge as ChallengeComponent } from "./challenge";
import { ResultCard } from "./result-card";
import { QuestionBubble } from "./question-bubble";
import { TypeAnswerChallenge } from "./type-answer-challenge";
import { MatchPairsChallenge } from "./match-pairs-challenge";
import { FillInBlanksChallenge } from "./fill-in-blanks-challenge";
import { WordBankChallenge } from "./word-bank-challenge";

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (Challenge & {
    completed: boolean;
    challengeOptions: ChallengeOption[];
  })[];
  userSubscription: { isActive: boolean } | null;
  activeCourse: { title: string; imageSrc: string };
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
  activeCourse,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const { width, height } = useWindowSize();
  const router = useRouter();

  const [finishAudio, _f, finishControls] = useAudio({ src: "/finish.mp3" });
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: "/incorrect.wav" });
  const [pending, startTransition] = useTransition();

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() =>
    initialPercentage === 100 ? 0 : initialPercentage
  );
  const [challenges, setChallenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((c) => !c.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  // SELECT / ASSIST state
  const [selectedOption, setSelectedOption] = useState<number>();
  // TYPE_ANSWER state
  const [typedAnswer, setTypedAnswer] = useState("");
  // MATCH_PAIRS state
  const [matchPairsComplete, setMatchPairsComplete] = useState(false);

  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const resetChallengeState = () => {
    setSelectedOption(undefined);
    setTypedAnswer("");
    setMatchPairsComplete(false);
    setStatus("none");
  };

  const onNext = () => setActiveIndex((current) => current + 1);

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  // Determine if the current answer is correct
  const isAnswerCorrect = useCallback((): boolean => {
    if (!challenge) return false;
    if (challenge.type === "SELECT" || challenge.type === "ASSIST" || challenge.type === "FILL_IN_BLANKS") {
      const correctOpt = options.find((o) => o.correct);
      return correctOpt?.id === selectedOption;
    }
    if (challenge.type === "TYPE_ANSWER" || challenge.type === "WORD_BANK") {
      const correctOpt = options.find((o) => o.correct);
      return (
        typedAnswer.trim().toLowerCase() ===
        (correctOpt?.text ?? "").trim().toLowerCase()
      );
    }
    if (challenge.type === "MATCH_PAIRS") {
      return matchPairsComplete;
    }
    return false;
  }, [challenge, options, selectedOption, typedAnswer, matchPairsComplete]);

  // Whether there's a valid answer selected to enable the Check button
  const hasAnswer = (): boolean => {
    if (!challenge) return false;
    if (challenge.type === "SELECT" || challenge.type === "ASSIST" || challenge.type === "FILL_IN_BLANKS")
      return !!selectedOption;
    if (challenge.type === "TYPE_ANSWER" || challenge.type === "WORD_BANK") return typedAnswer.trim().length > 0;
    if (challenge.type === "MATCH_PAIRS") return matchPairsComplete;
    return false;
  };

  const onSkip = () => {
    if (status !== "none") return;

    startTransition(() => {
      reduceHearts(challenge.id)
        .then((response) => {
          if (response?.error === "hearts") {
            openHeartsModal();
            return;
          }
          incorrectControls.play();
          setStatus("wrong");
          if (!response?.error) {
            setHearts((prev) => Math.max(prev - 1, 0));
          }
        })
        .catch(() => toast.error("Something went wrong. Please try again."));
    });
  };

  const onContinue = () => {
    if (!hasAnswer() && status === "none") return;

    if (status === "wrong") {
      // Push the failed/skipped challenge to the back of the queue!
      setChallenges((current) => [...current, challenge]);
      setActiveIndex((current) => current + 1);
      resetChallengeState();
      return;
    }

    if (status === "correct") {
      onNext();
      resetChallengeState();
      return;
    }

    // MATCH_PAIRS auto-completes — always correct
    if (challenge.type === "MATCH_PAIRS") {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }
            correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 10));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
      return;
    }

    const correct = isAnswerCorrect();

    if (correct) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }
            correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 10));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }
            incorrectControls.play();
            setStatus("wrong");
            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    }
  };

  // ── Lesson complete screen ──────────────────────────────────────────────────
  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src="/finish.svg"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src="/finish.svg"
            alt="Finish"
            className="block lg:hidden"
            height={50}
            width={50}
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700 dark:text-neutral-200">
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard
              variant="points"
              value={challenges.length * 10}
            />
            <ResultCard
              variant="hearts"
              value={hearts}
            />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.type === "TYPE_ANSWER"
      ? challenge.question
      : challenge.type === "MATCH_PAIRS"
      ? challenge.question
      : challenge.type === "FILL_IN_BLANKS"
      ? "Fill in the blank"
      : challenge.type === "WORD_BANK"
      ? "Translate this sentence"
      : challenge.question;
  return (
    <>
      {finishAudio}
      {incorrectAudio}
      {correctAudio}
      <div className="flex flex-col h-[100dvh] dark:bg-slate-950">
        <Header
          hearts={hearts}
          percentage={percentage}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="min-h-full flex flex-col py-6">
            <div className="m-auto lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
              <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700 dark:text-neutral-200">
                {title}
              </h1>
              <div>
                {challenge.type === "ASSIST" && (
                  <QuestionBubble question={challenge.question} />
                )}

                {(challenge.type === "SELECT" || challenge.type === "ASSIST") && (
                  <ChallengeComponent
                    key={challenge.id}
                    options={options}
                    onSelect={onSelect}
                    status={status}
                    selectedOption={selectedOption}
                    disabled={pending}
                    type={challenge.type}
                    activeCourse={activeCourse}
                  />
                )}

                {challenge.type === "TYPE_ANSWER" && (
                  <TypeAnswerChallenge
                    key={challenge.id}
                    question={challenge.question}
                    correctAnswer={options.find((o) => o.correct)?.text ?? ""}
                    status={status}
                    disabled={pending}
                    onAnswerChange={setTypedAnswer}
                  />
                )}

                {challenge.type === "MATCH_PAIRS" && (
                  <MatchPairsChallenge
                    key={challenge.id}
                    options={options}
                    status={status}
                    disabled={pending || status !== "none"}
                    onComplete={(allMatched) => {
                      setMatchPairsComplete(allMatched);
                    }}
                    onWrongPair={() => {
                      startTransition(() => {
                        reduceHearts(challenge.id)
                          .then((response) => {
                            if (response?.error === "hearts") {
                              openHeartsModal();
                              return;
                            }
                            if (!response?.error) {
                              setHearts((prev) => Math.max(prev - 1, 0));
                            }
                          })
                          .catch(() => toast.error("Something went wrong. Please try again."));
                      });
                    }}
                  />
                )}

                {challenge.type === "FILL_IN_BLANKS" && (
                  <FillInBlanksChallenge
                    key={challenge.id}
                    question={challenge.question}
                    options={options}
                    onSelect={onSelect}
                    status={status}
                    selectedOption={selectedOption}
                    disabled={pending}
                  />
                )}

                {challenge.type === "WORD_BANK" && (
                  <WordBankChallenge
                    key={challenge.id}
                    options={options}
                    status={status}
                    disabled={pending}
                    onChange={setTypedAnswer}
                    question={challenge.question}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer
          disabled={pending || !hasAnswer()}
          status={status}
          onCheck={onContinue}
          onSkip={onSkip}
          hideCheck={challenge.type === "MATCH_PAIRS" && !matchPairsComplete}
        />
      </div>
    </>
  );
};
