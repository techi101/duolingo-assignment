import { Loader } from "lucide-react";
import Image from "next/image";

const QUOTES = [
  "Protip: The owl is always watching.",
  "15 minutes a day can teach you a language. What can 15 minutes of scrolling do?",
  "Learning a language makes your brain bigger! (Not literally, that would hurt.)",
  "Mistakes are proof that you are trying... unless you ignore them.",
  "Did you know? Spanish is the second most spoken native language in the world!",
  "Protip: Repeat each sentence in a lesson out loud.",
  "Don't make the green owl angry. Do your lesson.",
  "Loading your daily dose of language learning..."
];

const Loading = () => {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-y-6 bg-white dark:bg-slate-900 absolute inset-0 z-50">
      <div className="relative h-24 w-24 lg:h-32 lg:w-32 animate-bounce">
        <Image
          src="/mascot.svg"
          fill
          alt="Mascot Loading"
        />
      </div>
      <div className="flex flex-col items-center gap-y-2 mt-4">
        <h2 className="text-sm font-bold text-neutral-400 dark:text-neutral-300 uppercase tracking-widest">Loading...</h2>
        <p className="text-muted-foreground dark:text-neutral-200 text-sm lg:text-base font-bold text-center px-6 max-w-[400px]">
          {quote}
        </p>
      </div>
    </div>
  );
};

export default Loading;
