import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "rightfit"
  | "rightfit-dark"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "destructive";

export type ButtonSize = "default" | "sm" | "lg" | "xl" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  // Rightfit-style primary (Deep Jet Black with tactile micro-shadows & hover lift)
  default:
    "border border-neutral-900 bg-[#121212] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.18)] hover:bg-[#1a1a1a] hover:shadow-[0_2px_6px_rgba(0,0,0,0.2),0_8px_20px_-4px_rgba(0,0,0,0.22)] hover:-translate-y-[0.5px] active:translate-y-0 active:scale-[0.99]",
  
  // Rightfit-style exact white button (from rightfit.so login)
  rightfit:
    "border border-black/[0.08] bg-white text-[#1c1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.05)] [--foreground:#1c1d1f] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_20px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-[0.5px] active:translate-y-0 active:scale-[0.99]",

  // Rightfit-style dark button
  "rightfit-dark":
    "border border-white/[0.12] bg-[#121212] text-white shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_14px_-2px_rgba(0,0,0,0.4)] hover:bg-[#1f1f23] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4),0_8px_24px_-4px_rgba(0,0,0,0.3)] hover:-translate-y-[0.5px] active:translate-y-0 active:scale-[0.99]",

  outline:
    "border border-black/[0.08] dark:border-white/[0.12] bg-transparent text-[#1c1d1f] dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:-translate-y-[0.5px] active:translate-y-0 active:scale-[0.99]",

  secondary:
    "border border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 hover:-translate-y-[0.5px] active:translate-y-0 active:scale-[0.99]",

  ghost:
    "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800/60",

  link:
    "text-neutral-900 underline-offset-4 hover:underline p-0 h-auto",

  destructive:
    "border border-red-200 bg-red-600 text-white hover:bg-red-700 shadow-sm hover:-translate-y-[0.5px] active:translate-y-0",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-6 py-2.5",
  sm: "h-8 rounded-xl px-3.5 text-xs",
  lg: "h-12 rounded-2xl px-8 text-base",
  xl: "h-14 rounded-2xl px-10 text-base font-semibold",
  icon: "h-10 w-10 p-0 rounded-2xl",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  animateChroma?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      animateChroma = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        tabIndex={0}
        data-slot="button"
        className={cn(
          "inline-flex shrink-0 transform-gpu items-center justify-center gap-2 rounded-2xl text-sm font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-neutral-400/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 chroma-text-animate-parent",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {animateChroma && typeof children === "string" ? (
          <span className="chroma-text-out chroma-text-out-animate">{children}</span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
