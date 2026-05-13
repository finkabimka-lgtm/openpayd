import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const variants = {
  primary: "bg-gradient-to-r from-azure to-orchid text-white shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 hover:shadow-xl",
  secondary: "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50",
  danger: "bg-rose-600 text-white hover:bg-rose-700"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
