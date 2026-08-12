import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#2B0A1F] border border-[#E6007E] flex items-center justify-center text-[#FF4FA0] mb-4 shadow-2xl">
        <ShoppingBag className="w-8 h-8" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">404</h1>
      <h2 className="text-xl font-bold text-[#FF4FA0] mb-4">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-gray-400 max-w-md mb-8 leading-relaxed">
        The requested page does not exist or has been moved. Explore our luxury hair collection below.
      </p>

      <Link
        href="/"
        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-sm shadow-xl hover:opacity-90 transition-opacity"
      >
        Return to Storefront →
      </Link>
    </div>
  );
}
