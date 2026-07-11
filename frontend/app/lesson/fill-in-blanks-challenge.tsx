"use client";

import { cn } from "@/lib/utils";
import { challengeOptions } from "@/db/schema";
import { Button } from "@/components/ui/button";

type Props = {
  question: string; // e.g. "Yo ____ el pan"
  options: typeof challengeOptions.$inferSelect[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
};

export const FillInBlanksChallenge = ({
  question,
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
}: Props) => {
  const parts = question.split("____");
  
  const selectedText = selectedOption 
    ? options.find((o) => o.id === selectedOption)?.text 
    : "";

  return (
    <div className="flex flex-col gap-y-12">
      {/* The Sentence with the Blank */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-neutral-200">
        {parts.map((part, index) => (
          <span key={index} className="flex items-center">
            {part}
            {index < parts.length - 1 && (
              <div 
                onClick={() => selectedOption && !disabled && status === "none" && onSelect(selectedOption)} // Tapping it could clear it if we want, or do nothing. We'll do nothing for now since onSelect is just setting the ID. Wait, onSelect is from quiz.tsx which sets it.
                className={cn(
                  "inline-flex items-center justify-center min-w-[100px] h-[50px] border-b-4 mx-2 px-4 transition-colors",
                  selectedOption ? "border-neutral-400 text-neutral-700 dark:text-neutral-200" : "border-neutral-200 dark:border-neutral-700",
                  status === "correct" && selectedOption && "border-green-500 text-green-500 dark:border-green-400 dark:text-green-400",
                  status === "wrong" && selectedOption && "border-rose-500 text-rose-500 dark:border-rose-400 dark:text-rose-400",
                )}
              >
                {selectedText}
              </div>
            )}
          </span>
        ))}
      </div>

      {/* The Options Bank */}
      <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2 max-w-[600px] mx-auto w-full">
        {options.map((option) => (
          <Button
            key={option.id}
            variant={selectedOption === option.id ? "secondary" : "default"}
            className={cn(
              "h-auto py-4 text-base lg:text-xl font-bold dark:border-slate-800",
              selectedOption === option.id && "bg-sky-100 text-sky-500 border-sky-300 hover:bg-sky-100 dark:bg-sky-900 dark:text-sky-300 dark:border-sky-800",
              status === "correct" && selectedOption === option.id && "bg-green-100 text-green-500 border-green-300 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-400 dark:border-green-800",
              status === "wrong" && selectedOption === option.id && "bg-rose-100 text-rose-500 border-rose-300 hover:bg-rose-100 dark:bg-rose-900/50 dark:text-rose-400 dark:border-rose-800",
            )}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
          >
            {option.text}
          </Button>
        ))}
      </div>
    </div>
  );
};
