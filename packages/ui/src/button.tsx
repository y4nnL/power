import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonVariant = "default" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost: "bg-transparent text-brand-600 hover:bg-brand-50",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", loading = false, disabled, asChild = false, children, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    const componentProps = asChild
      ? { "data-disabled": isDisabled ? "" : undefined, "aria-disabled": isDisabled }
      : { disabled: isDisabled };

    return (
      <Component
        ref={ref}
        className={twMerge(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          className
        )}
        {...componentProps}
        {...props}
      >
        {loading ? <span className="animate-pulse">Loading…</span> : children}
      </Component>
    );
  }
);

Button.displayName = "Button";
