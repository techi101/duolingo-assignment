"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/actions/user-profile";
import { toast } from "sonner";
import { Check } from "lucide-react";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentUsername: string;
  currentImageSrc: string;
};

// Available avatars from the public/avatars folder + some root icons
const AVATAR_OPTIONS = [
  "/mascot.svg",
  "/boy.svg",
  "/girl.svg",
  "/man.svg",
  "/woman.svg",
  "/bear.png",
  "/aunt.png",
  "/uncle.png"
];

export const EditProfileModal = ({ isOpen, setIsOpen, currentUsername, currentImageSrc }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState(currentUsername);
  const [imageSrc, setImageSrc] = useState(currentImageSrc);

  const onSubmit = () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    startTransition(() => {
      updateUserProfile(username, imageSrc)
        .then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success("Profile updated!");
            setIsOpen(false);
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 text-neutral-800 dark:text-neutral-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
          <DialogDescription className="text-neutral-500 dark:text-neutral-400">
            Change your username and select a new avatar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              disabled={isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:text-neutral-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">Avatar</label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = imageSrc === avatar;
                return (
                  <button
                    key={avatar}
                    disabled={isPending}
                    onClick={() => setImageSrc(avatar)}
                    className={`relative rounded-xl border-2 p-2 aspect-square flex items-center justify-center transition-all ${
                      isSelected 
                        ? "border-sky-400 bg-sky-50 dark:bg-sky-900/30" 
                        : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Image src={avatar} alt="Avatar" width={50} height={50} className="object-contain w-full h-full" />
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-sky-500 text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3 font-bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={isPending} variant="dangerOutline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isPending} onClick={onSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
