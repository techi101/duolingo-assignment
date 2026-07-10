import { Loader } from "lucide-react";
import Image from "next/image";

const QUOTES = [
  "15 minutes a day can teach you a language. What can 15 minutes of social media do?",
  "Learning a language makes your brain bigger!",
  "The hardest part is getting started. You've got this!",
  "Mistakes are proof that you are trying.",
  "Your language learning journey starts here!"
];

const Loading = () => {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-y-6 bg-white absolute inset-0 z-50">
      <div className="relative h-24 w-24 lg:h-32 lg:w-32 animate-bounce">
        <Image
          src="/mascot.svg"
          fill
          alt="Mascot Loading"
        />
      </div>
      <p className="text-muted-foreground text-sm lg:text-lg font-bold text-center px-6 max-w-[400px]">
        "{quote}"
      </p>
      <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
    </div>
  );
};

export default Loading;
