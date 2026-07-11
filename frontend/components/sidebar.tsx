import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";

type Props = { className?: string };

const NAV_ITEMS = [
  { label: "LEARN",        href: "/learn",        iconSrc: "/learn.svg"       },
  { label: "LEADERBOARDS", href: "/leaderboard",  iconSrc: "/leaderboard.svg" },
  { label: "QUESTS",       href: "/quests",       iconSrc: "/quests.svg"      },
  { label: "SHOP",         href: "/shop",         iconSrc: "/shop.svg"        },
  { label: "PROFILE",      href: "/profile",      iconSrc: "/quests.svg"      },
  { label: "MORE",         href: "/settings",     iconSrc: "/more.svg"        },
];

export const Sidebar = ({ className }: Props) => {
  return (
    <div className={cn(
      "flex h-full md:w-[256px] md:fixed left-0 top-0",
      "flex-col border-r-2 border-gray-100 bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-neutral-200",
      className,
    )}>
      {/* Logo */}
      <Link href="/learn" className="group px-6">
        <div className="py-7 flex items-center pl-4">
          <span className="text-3xl font-black text-[#58CC02] tracking-tighter">
            duolingo
          </span>
        </div>
      </Link>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4 mb-2" />

      {/* Navigation */}
      <nav className="flex flex-col gap-y-1 px-3 flex-1 pt-2">
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.href}
            label={item.label}
            href={item.href}
            iconSrc={item.iconSrc}
          />
        ))}
      </nav>

      {/* User Profile at bottom */}
      <div className="p-4 border-t-2 border-gray-100">
        <Link href="/profile">
          <div className="flex items-center gap-x-3 px-3 py-2 rounded-2xl hover:bg-[#F7F7F7] transition-colors cursor-pointer">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#58CC02] to-[#46A302]
                              flex items-center justify-center text-white font-black text-sm
                              ring-2 ring-[#58CC02]/20 shadow-sm">
                L
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#58CC02] border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0 hidden md:block">
              <p className="font-extrabold text-[#3C3C3C] text-sm truncate">Learner</p>
              <p className="text-[#AFAFAF] text-xs font-bold truncate">View Profile →</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
