"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/store/use-settings";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export const SettingsClient = () => {
  const { voicePreferences, setVoicePreference } = useSettings();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  if (!isClient) return null;

  const getFilteredVoices = (langPrefix: string) => {
    const filtered = voices.filter((v) => v.lang.startsWith(langPrefix));
    const seen = new Set();
    return filtered.filter((v) => {
      if (seen.has(v.voiceURI)) return false;
      seen.add(v.voiceURI);
      return true;
    });
  };

  const playSample = (voiceURI: string, text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.voiceURI === voiceURI);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const languages = [
    { name: "English", code: "en", sample: "Hello, nice to meet you." },
    { name: "Spanish", code: "es", sample: "Hola, encantado de conocerte." },
    { name: "French", code: "fr", sample: "Bonjour, ravi de vous rencontrer." },
  ];

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-700 dark:text-neutral-200">Voice & Appearance</h2>
          <ThemeToggle />
        </div>
        <p className="text-muted-foreground text-sm mb-8 font-semibold">
          Choose the voice and accent you want to hear for each language. These options depend on your device's built-in voices.
        </p>
        
        <div className="space-y-8">
          {languages.map((lang) => {
            const availableVoices = getFilteredVoices(lang.code);
            const currentPref = voicePreferences[lang.code];

            return (
              <div key={lang.code} className="flex flex-col gap-2 border-b-2 border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="font-extrabold text-lg text-neutral-800">{lang.name}</h3>
                
                {availableVoices.length === 0 ? (
                  <p className="text-sm text-neutral-500 italic">No native voices installed for this language.</p>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <select
                      className="flex-1 p-3 border-2 border-gray-200 rounded-xl font-medium bg-gray-50 focus:border-[#1CB0F6] outline-none transition-colors"
                      value={currentPref || ""}
                      onChange={(e) => setVoicePreference(lang.code, e.target.value)}
                    >
                      <option value="">System Default</option>
                      {availableVoices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                    <Button 
                      variant="primaryOutline" 
                      onClick={() => playSample(currentPref || availableVoices[0].voiceURI, lang.sample)}
                    >
                      <Volume2 className="w-5 h-5 mr-2" />
                      Test Voice
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
