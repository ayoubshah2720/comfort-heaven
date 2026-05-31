import React from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#E8B800] text-white hover:bg-[#d4a700] font-semibold",
  outline: "border border-[#E8B800] text-[#E8B800] hover:bg-[#E8B800] hover:text-white font-semibold",
  ghost: "text-gray-700 hover:bg-gray-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-5 py-2 text-sm",
  lg: "px-8 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded transition-colors duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
