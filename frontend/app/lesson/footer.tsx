import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle, Flag } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useReportModal } from "@/store/use-report-modal";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
  hideCheck?: boolean;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  lessonId,
  hideCheck,
  onSkip,
}: Props & { onSkip?: () => void }) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");
  const { open: openReport } = useReportModal();

  return (
    <footer className={cn(
      "lg:h-[140px] h-auto min-h-[100px] py-4 lg:py-0 border-t-2",
      status === "correct" && "border-transparent bg-green-100 dark:bg-green-900/30",
      status === "wrong" && "border-transparent bg-rose-100 dark:bg-rose-900/30",
    )}>
      <div className="max-w-[1140px] h-full mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between px-4 lg:px-10 gap-4">
        
        {/* Left Side: Skip, Feedback, or Report */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-y-2 sm:gap-x-4 flex-1">
          
          {status === "none" && !hideCheck && (
            <Button
              variant="default"
              size={isMobile ? "sm" : "lg"}
              onClick={onSkip}
              disabled={disabled}
              className="text-neutral-400 hover:text-neutral-500 bg-transparent hover:bg-neutral-100 border-2 border-transparent dark:hover:bg-slate-800"
            >
              SKIP
            </Button>
          )}

          {status === "correct" && (
            <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
              <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
              Nicely done!
            </div>
          )}

          {status === "wrong" && (
            <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center">
              <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
              Try again.
            </div>
          )}

          {(status === "correct" || status === "wrong") && (
            <button 
              onClick={openReport}
              className="flex items-center text-sm font-bold text-neutral-400/80 hover:text-neutral-500 uppercase md:ml-4"
            >
              <Flag className="h-4 w-4 mr-1" />
              Report
            </button>
          )}

        </div>
        {status === "completed" && (
          <Button
            variant="default"
            size={isMobile ? "sm" : "lg"}
            onClick={() => window.location.href = `/lesson/${lessonId}`}
          >
            Practice again
          </Button>
        )}
        {!hideCheck && (
          <Button
            disabled={disabled}
            className="ml-auto"
            onClick={onCheck}
            size={isMobile ? "sm" : "lg"}
            variant={status === "wrong" ? "danger" : "secondary"}
          >
            {status === "none" && "Check"}
            {status === "correct" && "Next"}
            {status === "wrong" && "Retry"}
            {status === "completed" && "Continue"}
          </Button>
        )}
        {hideCheck && status === "none" && (
          <p className="ml-auto text-sm font-bold text-gray-400 animate-pulse">
            Match all pairs to continue →
          </p>
        )}
      </div>
    </footer>
  );
};
