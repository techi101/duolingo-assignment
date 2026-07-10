import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "rounded-2xl text-sm font-extrabold uppercase tracking-wider",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none cursor-pointer",
    "active:translate-y-[2px]",
  ].join(" "),
  {
    variants: {
      variant: {
        // ── Main CTA green (Learn, Start, Continue) ─────────────────────────
        default: [
          "bg-[#58CC02] text-white",
          "border-b-[4px] border-[#46A302]",
          "hover:bg-[#61DC03] hover:brightness-105",
          "focus-visible:ring-green-300",
          "active:border-b-[0px] active:mt-[4px]",
          "shadow-none",
        ].join(" "),

        // ── Blue primary ────────────────────────────────────────────────────
        primary: [
          "bg-[#1CB0F6] text-white",
          "border-b-[4px] border-[#0098D4]",
          "hover:brightness-105",
          "focus-visible:ring-blue-300",
          "active:border-b-[0px] active:mt-[4px]",
        ].join(" "),
        primaryOutline: "bg-white text-[#1CB0F6] border-2 border-[#1CB0F6] hover:bg-[#F0F9FF]",

        // ── Green secondary ─────────────────────────────────────────────────
        secondary: [
          "bg-[#58CC02] text-white",
          "border-b-[4px] border-[#46A302]",
          "hover:brightness-105",
          "active:border-b-[0px] active:mt-[4px]",
        ].join(" "),
        secondaryOutline: "bg-white text-[#58CC02] border-2 border-[#58CC02] hover:bg-[#F0FFF0]",

        // ── Danger red ──────────────────────────────────────────────────────
        danger: [
          "bg-[#FF4B4B] text-white",
          "border-b-[4px] border-[#EA2B2B]",
          "hover:brightness-105",
          "active:border-b-[0px] active:mt-[4px]",
        ].join(" "),
        dangerOutline: "bg-white text-[#FF4B4B] border-2 border-[#FF4B4B] hover:bg-[#FFF0F0]",

        // ── Super / purple ──────────────────────────────────────────────────
        super: [
          "bg-[#CE82FF] text-white",
          "border-b-[4px] border-[#A560D1]",
          "hover:brightness-105",
          "active:border-b-[0px] active:mt-[4px]",
        ].join(" "),
        superOutline: "bg-white text-[#CE82FF] border-2 border-[#CE82FF] hover:bg-[#FAF0FF]",

        // ── Locked / disabled state ─────────────────────────────────────────
        locked: [
          "bg-[#AFAFAF] text-white",
          "border-b-[4px] border-[#8a8a8a]",
          "hover:brightness-105",
          "active:border-b-[0px] active:mt-[4px]",
        ].join(" "),

        // ── Ghost ───────────────────────────────────────────────────────────
        ghost: "bg-transparent text-[#777] border-transparent hover:bg-gray-100 border-0 font-bold normal-case tracking-normal",

        // ── Sidebar nav ─────────────────────────────────────────────────────
        sidebar: [
          "bg-transparent text-[#3C3C3C] border-2 border-transparent",
          "hover:bg-[#F7F7F7] hover:border-[#E5E5E5]",
          "rounded-2xl font-bold normal-case tracking-normal",
          "transition-all duration-150",
        ].join(" "),
        sidebarOutline: [
          "bg-[#EAF9E0] text-[#58CC02] border-2 border-[#C7EDAB]",
          "hover:bg-[#DDF5C9]",
          "rounded-2xl font-bold normal-case tracking-normal",
        ].join(" "),

        // ── Outline white (for dark BGs) ────────────────────────────────────
        outline: [
          "bg-white text-[#3C3C3C] border-2 border-[#E5E5E5]",
          "border-b-[4px] border-b-[#D1D1D1]",
          "hover:bg-gray-50",
          "active:border-b-[0px] active:mt-[4px]",
        ].join(" "),
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm:      "h-9 px-4 py-2 text-xs",
        lg:      "h-14 px-8 py-4 text-base",
        xl:      "h-16 px-10 py-5 text-lg",
        icon:    "h-10 w-10 p-0",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
