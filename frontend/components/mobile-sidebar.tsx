"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "LEARN",        href: "/learn",       iconSrc: "/learn.svg"       },
  { label: "LEADERBOARDS", href: "/leaderboard", iconSrc: "/leaderboard.svg" },
  { label: "QUESTS",       href: "/quests",      iconSrc: "/quests.svg"      },
  { label: "SHOP",         href: "/shop",        iconSrc: "/shop.svg"        },
  { label: "PROFILE",      href: "/profile",     iconSrc: "/quests.svg"      },
  { label: "MORE",         href: "/settings",    iconSrc: "/more.svg"        },
];

const MobileNavItem = ({
  label,
  href,
  iconSrc,
  onClose,
}: {
  label: string;
  href: string;
  iconSrc: string;
  onClose: () => void;
}) => {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClose}
      className={`flex items-center gap-x-3 px-4 py-3 rounded-2xl w-full font-extrabold text-sm uppercase tracking-wider mb-1 transition-all duration-150 ease-out hover:bg-[#F7F7F7] dark:hover:bg-slate-800 ${
        active
          ? "bg-[#EAF9E0] text-[#58CC02] border-2 border-[#C7EDAB] shadow-sm dark:bg-[#58CC02]/10 dark:border-[#58CC02]/30 dark:text-[#58CC02]"
          : "text-[#AFAFAF] border-2 border-transparent hover:border-[#EFEFEF] dark:hover:border-slate-700 dark:text-neutral-200"
      }`}
    >
      <div className={`w-8 h-8 relative flex-shrink-0 transition-transform duration-200 ${active ? "scale-110" : ""}`}>
        <Image src={iconSrc} alt={label} fill className="object-contain" />
      </div>
      <span
        className={`block ${active ? "text-[#58CC02] dark:text-[#58CC02]" : "text-[#3C3C3C] dark:text-neutral-200"}`}
      >
        {label}
      </span>
    </Link>
  );
};

export const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="bg-transparent border-none cursor-pointer p-0 flex"
      >
        <Menu className="text-white" size={26} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-[200]"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] max-w-[85vw] bg-white dark:bg-slate-900 z-[300] flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <span className="text-[28px] font-black text-[#58CC02] tracking-tighter">
            duolingo
          </span>
          <button
            onClick={() => setOpen(false)}
            className="bg-transparent border-none cursor-pointer p-1 flex"
            aria-label="Close menu"
          >
            <X size={22} className="text-[#AFAFAF]" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-[#f0f0f0] dark:bg-slate-800 mx-4 mb-2" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-y-1">
          {NAV_ITEMS.map((item) => (
            <MobileNavItem
              key={item.href}
              label={item.label}
              href={item.href}
              iconSrc={item.iconSrc}
              onClose={() => setOpen(false)}
            />
          ))}
        </nav>

        {/* User profile at bottom */}
        <div className="border-t-2 border-[#f0f0f0] dark:border-slate-800 p-4">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-x-3 px-3 py-2.5 rounded-2xl bg-transparent hover:bg-[#F7F7F7] dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
              L
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-[#3C3C3C] dark:text-neutral-200 text-[14px] m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                Learner
              </p>
              <p className="text-[#AFAFAF] text-[12px] font-bold m-0">
                View Profile →
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
