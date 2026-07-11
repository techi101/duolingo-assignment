"use client";

import { useState } from "react";
import { Pen } from "lucide-react";
import { EditProfileModal } from "./modals/edit-profile-modal";

type Props = {
  currentUsername: string;
  currentImageSrc: string;
};

export const EditProfileButton = ({ currentUsername, currentImageSrc }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 bg-white/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-full p-2 transition-colors border-2 border-gray-200 dark:border-slate-700"
      >
        <Pen className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
      </button>

      <EditProfileModal 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        currentUsername={currentUsername} 
        currentImageSrc={currentImageSrc} 
      />
    </>
  );
};
