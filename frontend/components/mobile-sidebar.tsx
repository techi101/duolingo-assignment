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
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "16px",
        border: "2px solid",
        borderColor: active ? "#C7EDAB" : "transparent",
        backgroundColor: active ? "#EAF9E0" : "transparent",
        marginBottom: "4px",
        textDecoration: "none",
      }}
    >
      <div style={{ width: "32px", height: "32px", position: "relative", flexShrink: 0 }}>
        <Image src={iconSrc} alt={label} fill className="object-contain" />
      </div>
      <span
        style={{
          fontWeight: 800,
          fontSize: "13px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: active ? "#58CC02" : "#3C3C3C",
        }}
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
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
      >
        <Menu className="text-white" size={26} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 200,
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "280px",
          maxWidth: "85vw",
          backgroundColor: "#ffffff",
          zIndex: 300,
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
          <span style={{ fontSize: "28px", fontWeight: 900, color: "#58CC02", letterSpacing: "-1px" }}>
            duolingo
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}
            aria-label="Close menu"
          >
            <X size={22} color="#AFAFAF" />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: "2px", backgroundColor: "#f0f0f0", margin: "0 16px 8px" }} />

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "8px 12px" }}>
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
        <div style={{ borderTop: "2px solid #f0f0f0", padding: "12px 16px" }}>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "16px",
              textDecoration: "none",
              backgroundColor: "transparent",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #58CC02, #46A302)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 900,
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              L
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 800, color: "#3C3C3C", fontSize: "14px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Learner
              </p>
              <p style={{ color: "#AFAFAF", fontSize: "12px", fontWeight: 700, margin: 0 }}>
                View Profile →
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
