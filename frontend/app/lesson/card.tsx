import Image from "next/image";
import { useCallback } from "react";
import { useAudio, useKey } from "react-use";

import { cn } from "@/lib/utils";
import { challenges } from "@/db/schema";
import { useSettings } from "@/store/use-settings";

type Props = {
  id: number;
  imageSrc: string | null;
  audioSrc: string | null;
  text: string;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  status?: "correct" | "wrong" | "none";
  type: typeof challenges.$inferSelect["type"];
  activeCourse?: { title: string };
};

export const Card = ({
  id,
  imageSrc,
  audioSrc,
  text,
  shortcut,
  selected,
  onClick,
  status,
  disabled,
  type,
  activeCourse,
}: Props) => {
  const [audio, _, controls] = useAudio({ src: audioSrc || "" });
  const { voicePreferences } = useSettings();

  const handleClick = useCallback(() => {
    if (disabled) return;

    if (audioSrc) {
      controls.play();
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      if (activeCourse) {
        // Map course title (e.g. "Spanish") to the language code ("es")
        const langMap: Record<string, string> = {
          "Spanish": "es",
          "English": "en",
          "French": "fr"
        };
        const langCode = langMap[activeCourse.title];
        if (langCode) {
          utterance.lang = langCode;
          if (voicePreferences[langCode]) {
            const prefURI = voicePreferences[langCode];
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.voiceURI === prefURI);
            if (voice) {
              utterance.voice = voice;
            }
          }
        }
      }
      window.speechSynthesis.speak(utterance);
    }

    onClick();
  }, [disabled, onClick, controls, audioSrc, text, activeCourse, voicePreferences]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:border-slate-700 p-4 lg:p-6 cursor-pointer active:border-b-2",
        selected && "border-sky-300 bg-sky-100 hover:bg-sky-100 dark:bg-sky-900/50 dark:hover:bg-sky-900/50",
        selected && status === "correct" 
          && "border-green-300 bg-green-100 hover:bg-green-100 dark:bg-green-900/50 dark:hover:bg-green-900/50",
        selected && status === "wrong" 
          && "border-rose-300 bg-rose-100 hover:bg-rose-100 dark:bg-rose-900/50 dark:hover:bg-rose-900/50",
        disabled && "pointer-events-none hover:bg-white dark:hover:bg-slate-800",
        type === "ASSIST" && "lg:p-3 w-full"
      )}
    >
      {audio}
      {imageSrc && (
        <div
          className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full"
        >
          <Image src={imageSrc} fill alt={text} />
        </div>
      )}
      <div className={cn(
        "flex items-center justify-between",
        type === "ASSIST" && "flex-row-reverse",
      )}>
        {type === "ASSIST" && <div />}
        <p className={cn(
          "text-neutral-600 dark:text-white text-sm lg:text-base",
          selected && "text-sky-500",
          selected && status === "correct" 
            && "text-green-500",
          selected && status === "wrong" 
            && "text-rose-500",
        )}>
          {text}
        </p>
        <div className={cn(
          "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] border-2 dark:border-slate-700 flex items-center justify-center rounded-lg text-neutral-400 dark:text-neutral-300 lg:text-[15px] text-xs font-semibold",
          selected && "border-sky-300 text-sky-500",
          selected && status === "correct" 
            && "border-green-500 text-green-500",
          selected && status === "wrong" 
            && "border-rose-500 text-rose-500",
        )}>
          {shortcut}
        </div>
      </div>
    </div>
  );
};
