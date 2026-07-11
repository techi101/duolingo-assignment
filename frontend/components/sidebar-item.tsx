"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: Props) => {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-3 px-4 py-3 rounded-2xl",
        "font-extrabold text-sm uppercase tracking-wider",
        "transition-all duration-150 ease-out",
        "hover:bg-[#F7F7F7]",
        active
          ? "bg-[#EAF9E0] text-[#58CC02] border-2 border-[#C7EDAB] shadow-sm"
          : "text-[#AFAFAF] border-2 border-transparent hover:border-[#EFEFEF]",
      )}
    >
      <div className={cn(
        "w-8 h-8 relative flex-shrink-0",
        "transition-transform duration-200",
        active && "scale-110",
      )}>
        <Image
          src={iconSrc}
          alt={label}
          fill
          className="object-contain"
        />
      </div>
      <span className={cn(
        "block",
        active ? "text-[#58CC02]" : "text-[#3C3C3C]",
      )}>
        {label}
      </span>
      {/* Active indicator dot for mobile */}
      {active && (
        <div className="md:hidden ml-auto w-1.5 h-1.5 rounded-full bg-[#58CC02]" />
      )}
    </Link>
  );
};
