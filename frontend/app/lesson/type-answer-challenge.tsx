"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  question: string;
  correctAnswer: string;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
  onAnswerChange: (answer: string) => void;
};

export const TypeAnswerChallenge = ({
  question,
  correctAnswer,
  status,
  disabled,
  onAnswerChange,
}: Props) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  // Reset on new question
  useEffect(() => {
    setValue("");
    onAnswerChange("");
  }, [question]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onAnswerChange(e.target.value);
  };

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div
        className={cn(
          "w-full rounded-2xl border-2 border-b-4 transition-all duration-200 dark:bg-slate-800",
          status === "none" && "border-gray-200 dark:border-slate-700 focus-within:border-[#58CC02] dark:focus-within:border-[#58CC02]",
          status === "correct" && "border-green-400 bg-green-50",
          status === "wrong" && "border-rose-400 bg-rose-50",
        )}
      >
        <input
          ref={inputRef}
          value={status === "wrong" ? correctAnswer : value}
          onChange={handleChange}
          disabled={disabled || status !== "none"}
          placeholder="Type your answer…"
          className={cn(
            "w-full bg-transparent px-5 py-4 text-lg font-bold outline-none rounded-2xl text-neutral-700 dark:text-neutral-200",
            "placeholder:text-gray-300 dark:placeholder:text-neutral-500 placeholder:font-normal",
            status === "correct" && "text-green-600 dark:text-green-600",
            status === "wrong" && "text-rose-500 line-through",
          )}
        />
      </div>
      {status === "wrong" && (
        <p className="mt-2 text-sm text-rose-500 font-semibold px-1">
          Correct answer: <span className="font-black">{correctAnswer}</span>
        </p>
      )}
    </div>
  );
};
