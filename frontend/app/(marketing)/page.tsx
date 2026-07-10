import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-16 max-w-5xl mx-auto w-full">

        {/* Mascot / Illustration */}
        <div className="relative flex-shrink-0">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-[#58CC02]/10 scale-125 blur-2xl" />
          <div className="relative w-[220px] h-[220px] lg:w-[360px] lg:h-[360px] animate-bounce-gentle">
            <Image
              src="/mascot.svg"
              fill
              alt="Duo the owl"
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Text + CTAs */}
        <div className="flex flex-col items-center lg:items-start gap-6 text-center lg:text-left max-w-md">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-black text-[#3C3C3C] leading-tight">
              The free, fun, and{" "}
              <span className="text-[#58CC02]">effective</span>{" "}
              way to learn a language!
            </h1>
            <p className="text-[#777] text-lg font-semibold">
              Learn Spanish with bite-size lessons. Earn XP, unlock achievements, and level up your skills.
            </p>
          </div>

          <div className="flex flex-col gap-y-3 w-full max-w-[360px]">
            <Link href="/learn" className="w-full">
              <Button size="lg" variant="secondary" className="w-full text-base font-black uppercase tracking-wider h-14 rounded-2xl">
                Get Started — It&apos;s Free
              </Button>
            </Link>
            <Link href="/learn" className="w-full">
              <Button size="lg" variant="outline" className="w-full text-base font-black uppercase tracking-wider h-14 rounded-2xl text-[#1CB0F6] border-[#1CB0F6] border-2">
                I already have an account
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 pt-2">
            {[
              { value: "500M+", label: "Learners" },
              { value: "40+", label: "Languages" },
              { value: "#1", label: "Education App" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center lg:items-start">
                <span className="text-xl font-black text-[#3C3C3C]">{value}</span>
                <span className="text-xs font-bold text-[#AFAFAF] uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Strip ──────────────────────────────────────────────── */}
      <section className="bg-[#F7F7F7] border-t-2 border-gray-100 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { emoji: "🎮", title: "Gamified Learning", desc: "Earn XP, maintain streaks, and level up just like a game." },
            { emoji: "❤️", title: "Heart System", desc: "Stay focused — lose a heart on a wrong answer, earn them back with practice." },
            { emoji: "🏆", title: "Leaderboard", desc: "Compete with other learners and climb the weekly leaderboard." },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-3xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span className="text-4xl">{emoji}</span>
              <h3 className="font-black text-[#3C3C3C] text-lg">{title}</h3>
              <p className="text-[#777] font-semibold text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Languages row ────────────────────────────────────────────────── */}
      <section className="py-10 px-6 bg-white border-t-2 border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#AFAFAF] font-bold text-xs uppercase tracking-widest mb-6">
            Available Language
          </p>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
              <Image src="/spain.svg" alt="Spanish" width={40} height={28} className="rounded-md shadow-sm" />
              <span className="font-extrabold text-[#3C3C3C]">Spanish</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}