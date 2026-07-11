import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  voicePreferences: Record<string, string>; // Language Name (e.g., "Spanish") to Voice URI
  setVoicePreference: (language: string, voiceURI: string) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      voicePreferences: {},
      setVoicePreference: (language, voiceURI) =>
        set((state) => ({
          voicePreferences: {
            ...state.voicePreferences,
            [language]: voiceURI,
          },
        })),
    }),
    {
      name: "lingo-settings",
    }
  )
);
