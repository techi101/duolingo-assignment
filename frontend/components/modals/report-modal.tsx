"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Flag } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useReportModal } from "@/store/use-report-modal";

const REPORT_OPTIONS = [
  { id: "audio-incorrect", label: "The audio does not sound correct." },
  { id: "hints-wrong", label: "The dictionary hints on hover are wrong." },
  { id: "audio-missing", label: "The audio is missing." },
  { id: "hints-missing", label: "The dictionary hints on hover are missing." },
  { id: "answer-accepted", label: "My answer should be accepted." },
  { id: "something-else", label: "Something else went wrong." },
];

export const ReportModal = () => {
  const { isOpen, close } = useReportModal();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const onSubmit = () => {
    toast.success("Thank you for your report! We will review it shortly.", {
      icon: <Flag className="h-4 w-4" />,
    });
    setSelected([]);
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && close()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-700 dark:text-neutral-200 flex items-center gap-x-2">
            <Flag className="h-5 w-5 text-rose-500" />
            Report an Issue
          </DialogTitle>
          <DialogDescription>
            What went wrong with this exercise? Please select all that apply.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-y-4 py-4">
          {REPORT_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={option.id}
                checked={selected.includes(option.id)}
                onChange={() => toggleOption(option.id)}
                className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
              />
              <label
                htmlFor={option.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-neutral-300"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="primary"
            className="w-full"
            onClick={onSubmit}
            disabled={selected.length === 0}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
