'use client';

import React from 'react';

interface MotionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MotionButton({ children, className = '', onClick, ...props }: MotionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-block cursor-pointer ${className}`}
      {...props}
    >
      <div
        className="relative z-10 inline-flex h-12 items-center justify-center overflow-hidden rounded-full
        bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] border-2 border-[#FF4FA0] 
        px-6 font-extrabold text-white text-sm tracking-wide transition-all duration-300 
        group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 shadow-lg"
      >
        {children}
      </div>
      <div
        className="absolute inset-0 z-0 h-full w-full rounded-full transition-all duration-300 
        group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 
        group-hover:[box-shadow:4px_4px_#2B0A1F,8px_8px_#E6007E]"
      />
    </button>
  );
}
