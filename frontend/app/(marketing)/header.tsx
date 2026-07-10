"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="h-16 w-full border-b-2 border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-full px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-x-2 group">
          <div className="relative">
            <Image src="/mascot.svg" height={36} width={36} alt="Lingo Mascot" className="transition-transform group-hover:scale-110 duration-200" />
          </div>
          <span className="text-2xl font-black text-[#58CC02] tracking-wide">
            lingo
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-x-2">
          <Link href="/learn">
            <Button variant="ghost" size="sm" className="text-[#777] hover:text-[#3C3C3C] font-extrabold text-xs uppercase tracking-wider">
              Courses
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost" size="sm" className="text-[#777] hover:text-[#3C3C3C] font-extrabold text-xs uppercase tracking-wider">
              Leaderboard
            </Button>
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-x-3">
          <Link href="/learn">
            <Button variant="outline" size="sm" className="hidden sm:flex font-extrabold text-xs uppercase tracking-wider text-[#1CB0F6] border-[#1CB0F6] border-2 hover:bg-[#EBF8FE]">
              Log in
            </Button>
          </Link>
          <Link href="/learn">
            <Button variant="secondary" size="sm" className="font-extrabold text-xs uppercase tracking-wider">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};