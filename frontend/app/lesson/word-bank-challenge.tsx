import { useState, useEffect } from "react";
import Image from "next/image";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  options: any[];
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
  onChange: (value: string) => void;
  question: string;
};

export const WordBankChallenge = ({
  options,
  status,
  disabled,
  onChange,
  question,
}: Props) => {
  // Parse question format: "MASCOT_NAME|Instruction|ForeignPhrase"
  // e.g. "UNCLE|Write this in English|Un café"
  const parts = question.split("|");
  const mascot = parts.length > 2 ? parts[0].toLowerCase() : "uncle";
  const instruction = parts.length > 2 ? parts[1] : question;
  const foreignPhrase = parts.length > 2 ? parts[2] : "";

  const [availableWords, setAvailableWords] = useState<{ id: string; word: string }[]>([]);
  const [selectedWords, setSelectedWords] = useState<{ id: string; word: string }[]>([]);

  const [isSpeaking, setIsSpeaking] = useState(false);

  // We expect the correct answer string from the single correct ChallengeOption
  // and distractor words from incorrect ChallengeOptions.
  useEffect(() => {
    const correctOpt = options.find(o => o.correct);
    if (!correctOpt) return;

    // Split the correct answer into words
    const correctWords = correctOpt.text.split(" ").map((word: string, i: number) => ({
      id: `correct-${i}`,
      word,
    }));

    // Get all distractor words
    const distractors = options
      .filter(o => !o.correct)
      .map(o => ({
        id: `distractor-${o.id}`,
        word: o.text,
      }));

    // Combine and shuffle (deterministic or just random since it's client side)
    const allWords = [...correctWords, ...distractors].sort(() => Math.random() - 0.5);
    setAvailableWords(allWords);
    setSelectedWords([]);
  }, [options]);

  const onWordSelect = (wordObj: { id: string; word: string }) => {
    if (disabled || status !== "none") return;
    setAvailableWords(prev => prev.filter(w => w.id !== wordObj.id));
    
    const newSelected = [...selectedWords, wordObj];
    setSelectedWords(newSelected);
    onChange(newSelected.map(w => w.word).join(" "));
  };

  const onWordDeselect = (wordObj: { id: string; word: string }) => {
    if (disabled || status !== "none") return;
    setSelectedWords(prev => prev.filter(w => w.id !== wordObj.id));
    
    const newAvailable = [...availableWords, wordObj];
    setAvailableWords(newAvailable);
    
    const newSelected = selectedWords.filter(w => w.id !== wordObj.id);
    onChange(newSelected.map(w => w.word).join(" "));
  };

  const speakForeignPhrase = () => {
    if (!foreignPhrase || isSpeaking) return;
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(foreignPhrase);
    utterance.rate = 0.9; // slightly slower for language learners
    
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full flex flex-col gap-y-6">
      <h1 className="text-lg lg:text-3xl font-bold text-neutral-700 dark:text-neutral-200">
        {instruction}
      </h1>
      
      {/* Mascot and Speech Bubble */}
      {foreignPhrase && (
        <div className="flex items-center gap-x-4">
          <img
            src={`/${mascot}.png`}
            alt={mascot}
            width={100}
            height={100}
            className={cn(
              "object-contain transition-all duration-300",
              isSpeaking ? "animate-bounce scale-110" : "animate-mascot-wiggle hover:scale-105"
            )}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/mascot.svg";
            }}
          />
          <div 
            className="relative px-4 py-3 border-2 rounded-2xl cursor-pointer hover:bg-neutral-50 dark:hover:bg-slate-800 transition shadow-sm"
            onMouseEnter={speakForeignPhrase}
            onClick={speakForeignPhrase}
          >
            <div className="flex items-center gap-x-2 text-sky-500 font-bold text-lg">
              <Volume2 className="h-5 w-5" />
              {foreignPhrase}
            </div>
            {/* Speech bubble tail */}
            <div className="absolute w-3 h-3 border-l-2 border-b-2 bg-white dark:bg-slate-950 transform rotate-45 -left-1.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-y-8 mt-4">
        {/* Answer Lines */}
        <div className="w-full min-h-[60px] border-b-2 border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-2 pb-2">
          {selectedWords.map(wordObj => (
            <div
              key={wordObj.id}
              onClick={() => onWordDeselect(wordObj)}
              className={cn(
                "px-4 py-2 border-2 border-b-4 border-neutral-200 rounded-xl text-neutral-700 font-bold text-base cursor-pointer hover:bg-neutral-100 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-slate-800 transition",
                status !== "none" && "cursor-default opacity-50 hover:bg-transparent"
              )}
            >
              {wordObj.word}
            </div>
          ))}
        </div>

        {/* Word Bank */}
        <div className="flex flex-wrap gap-2 justify-center min-h-[100px]">
          {availableWords.map(wordObj => (
            <div
              key={wordObj.id}
              onClick={() => onWordSelect(wordObj)}
              className={cn(
                "px-4 py-2 border-2 border-b-4 border-neutral-200 rounded-xl text-neutral-700 font-bold text-base cursor-pointer hover:bg-neutral-100 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-slate-800 transition shadow-sm",
                status !== "none" && "cursor-default opacity-50 hover:bg-transparent"
              )}
            >
              {wordObj.word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
