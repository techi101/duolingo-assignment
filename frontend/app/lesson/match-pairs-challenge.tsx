"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { ChallengeOption } from "@/db/queries";

import { useAudio } from "react-use";

type Pair = { word: string; translation: string };

type Props = {
  options: ChallengeOption[];
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
  onComplete: (allMatched: boolean) => void;
  onWrongPair: () => void;
};

export const MatchPairsChallenge = ({ options, status, disabled, onComplete, onWrongPair }: Props) => {
  const pairs: Pair[] = options.map((o) => {
    const [word, translation] = o.text.split("|||");
    return { word, translation };
  });

  const [leftItems] = useState<string[]>(() => shuffle(pairs.map((p) => p.word)));
  const [rightItems] = useState<string[]>(() => shuffle(pairs.map((p) => p.translation)));

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  
  // Track incorrect matches for visual feedback
  const [incorrectPair, setIncorrectPair] = useState<{left: string, right: string} | null>(null);

  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: "/incorrect.wav" });

  const correctMap = new Map(pairs.map((p) => [p.word, p.translation]));

  const handleSelect = (side: "left" | "right", value: string) => {
    // If already waiting for an incorrect pair to clear, do nothing
    if (incorrectPair) return;

    let newLeft = selectedLeft;
    let newRight = selectedRight;

    if (side === "left") {
      if (selectedLeft === value) newLeft = null;
      else newLeft = value;
      setSelectedLeft(newLeft);
    } else {
      if (selectedRight === value) newRight = null;
      else newRight = value;
      setSelectedRight(newRight);
    }

    if (newLeft && newRight) {
      const isCorrect = correctMap.get(newLeft) === newRight;
      if (isCorrect) {
        correctControls.play();
        setMatched((prev) => {
          const next = new Set(prev);
          next.add(newLeft!);
          if (next.size === pairs.length) {
            onComplete(true);
          }
          return next;
        });
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        incorrectControls.play();
        onWrongPair();
        setIncorrectPair({ left: newLeft, right: newRight });
        
        setTimeout(() => {
          setIncorrectPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
      }
    }
  };

  const isWordMatched = (word: string) => matched.has(word);
  const isTranslationMatched = (trans: string) =>
    [...matched].some((w) => correctMap.get(w) === trans);

  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-[600px] mx-auto">
      {correctAudio}
      {incorrectAudio}
      <div className="flex flex-col gap-3">
        {leftItems.map((word) => {
          const isMatched = isWordMatched(word);
          const isSelected = selectedLeft === word;
          const isError = incorrectPair?.left === word;
          return (
            <button
              key={word}
              disabled={disabled || isMatched || !!incorrectPair}
              onClick={() => !isMatched && handleSelect("left", word)}
              className={cn(
                "relative px-4 py-3 rounded-2xl border-2 border-b-4 font-bold text-sm transition-all duration-150",
                "hover:scale-[1.02] active:scale-[0.98] active:border-b-2",
                isMatched
                  ? "border-green-300 bg-green-50 text-green-600 pointer-events-none opacity-60"
                  : isError
                  ? "border-rose-300 bg-rose-50 text-rose-500 pointer-events-none"
                  : isSelected
                  ? "border-sky-400 bg-sky-50 text-sky-600"
                  : "border-gray-200 bg-white text-neutral-700 hover:border-gray-300",
              )}
            >
              {isMatched && (
                <CheckCircle2 className="absolute top-1 right-1 w-3.5 h-3.5 text-green-500" />
              )}
              {word}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {rightItems.map((trans) => {
          const isMatched = isTranslationMatched(trans);
          const isSelected = selectedRight === trans;
          const isError = incorrectPair?.right === trans;
          return (
            <button
              key={trans}
              disabled={disabled || isMatched || !!incorrectPair}
              onClick={() => !isMatched && handleSelect("right", trans)}
              className={cn(
                "px-4 py-3 rounded-2xl border-2 border-b-4 font-bold text-sm transition-all duration-150",
                "hover:scale-[1.02] active:scale-[0.98] active:border-b-2",
                isMatched
                  ? "border-purple-300 bg-purple-50 text-purple-600 pointer-events-none opacity-60"
                  : isError
                  ? "border-rose-300 bg-rose-50 text-rose-500 pointer-events-none"
                  : isSelected
                  ? "border-yellow-400 bg-yellow-50 text-yellow-600"
                  : "border-gray-200 bg-white text-neutral-700 hover:border-gray-300",
              )}
            >
              {trans}
            </button>
          );
        })}
      </div>
    </div>
  );
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
