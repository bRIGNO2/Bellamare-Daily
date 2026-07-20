import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: "bg-sea-600 hover:bg-sea-700 text-white",
  secondary: "bg-sun-500 hover:bg-sun-600 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "bg-white hover:bg-sea-50 text-sea-700 border-2 border-sea-200",
};

export function Button({ variant = "primary", fullWidth, className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      className={`${variantClasses[variant]} ${fullWidth ? "w-full" : ""} rounded-2xl px-6 py-4 text-xl font-semibold shadow-sm transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
