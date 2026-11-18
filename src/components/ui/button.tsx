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
  // Rightfit-style exact white button (from rightfit.so: Get Started / Login)
  rightfit:
    "border border-black/[0.08] bg-white text-[#1c1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.05)] [--foreground:#1c1d1f] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_20px_-4px_rgba(0,0,0,0.08)]",

  // Rightfit-style authentic black button (from rightfit.so: Hire with Rightfit)
  default:
    "border border-white/[0.12] bg-black text-white [--foreground:#ffffff] shadow-[0_1px_2px_rgba(0,0,0,0.2),0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.25),0_8px_20px_-4px_rgba(0,0,0,0.35)] hover:border-white/[0.25]",

  "rightfit-dark":
    "border border-white/[0.12] bg-black text-white [--foreground:#ffffff] shadow-[0_1px_2px_rgba(0,0,0,0.2),0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.25),0_8px_20px_-4px_rgba(0,0,0,0.35)]",

  outline:
    "border border-black/[0.08] bg-transparent text-[#1c1d1f] hover:bg-neutral-100/70 [--foreground:#1c1d1f]",

  secondary:
    "border border-transparent bg-neutral-100 text-[#1c1d1f] hover:bg-neutral-200/80 [--foreground:#1c1d1f]",

  ghost:
    "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80 [--foreground:#1c1d1f]",

  link:
    "text-neutral-900 underline-offset-4 hover:underline p-0 h-auto",

  destructive:
    "border border-red-200 bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-6 py-2.5 has-[>svg]:px-4",
  sm: "h-8 rounded-xl px-3.5 text-xs has-[>svg]:px-3",
  lg: "h-12 rounded-2xl px-8 text-base has-[>svg]:px-5",
  xl: "h-14 rounded-2xl px-10 text-base font-semibold has-[>svg]:px-6",
  icon: "h-10 w-10 p-0 rounded-2xl",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  withArrow?: boolean;
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("tabler-icon tabler-icon-arrow-right", className)}
    >
      <path d="M5 12l14 0" />
      <path d="M13 18l6 -6" />
      <path d="M13 6l6 6" />
    </svg>
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      withArrow = false,
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
          "inline-flex shrink-0 transform-gpu items-center justify-center gap-2 rounded-2xl text-sm font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 chroma-text-animate-parent",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {typeof children === "string" ? (
          <span className="chroma-text-out chroma-text-out-animate">{children}</span>
        ) : (
          children
        )}
        {withArrow && <ArrowRightIcon />}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
