import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-gray-500">{label}</label>}
      <input
        className={`w-full border-b border-gray-300 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#3D6B6B] transition-colors bg-transparent ${className}`}
        {...props}
      />
    </div>
  );
}
