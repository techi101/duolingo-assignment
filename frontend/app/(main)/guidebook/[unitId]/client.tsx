"use client";

import { useSettings } from "@/store/use-settings";
import { Volume2 } from "lucide-react";
import { useAudio } from "react-use";

type Phrase = {
  phrase: string;
  translation: string;
  audioSrc: string | null;
};

export const GuidebookClient = ({ 
  phrases,
  activeCourseTitle 
}: { 
  phrases: Phrase[];
  activeCourseTitle: string;
}) => {
  const { voicePreferences } = useSettings();
  
  // Try to find the language code for the current course
  const langMap: Record<string, string> = {
    "Spanish": "es",
    "English": "en",
    "French": "fr"
  };
  const langCode = langMap[activeCourseTitle];
  const preferredVoiceURI = langCode ? voicePreferences[langCode] : null;

  const playTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (langCode) {
      utterance.lang = langCode;
      if (preferredVoiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find((v) => v.voiceURI === preferredVoiceURI);
        if (voice) {
          utterance.voice = voice;
        }
      }
    }
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col gap-y-4">
      {phrases.map((item, index) => (
        <div key={index} className="border-2 border-gray-200 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center gap-x-4">
            <button 
              onClick={() => {
                if (item.audioSrc) {
                  const audio = new Audio(item.audioSrc);
                  audio.play();
                } else {
                  playTTS(item.phrase);
                }
              }}
              className="flex-shrink-0 text-[#1CB0F6] hover:bg-[#1CB0F6]/10 p-2 rounded-full transition-colors active:bg-[#1CB0F6]/20"
            >
              <Volume2 className="w-8 h-8 fill-[#1CB0F6] stroke-none" />
            </button>
            <div className="flex flex-col gap-1">
              <p className="text-xl font-medium text-neutral-800">
                {item.phrase}
              </p>
              <p className="text-base text-neutral-400 font-normal">
                {item.translation}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
