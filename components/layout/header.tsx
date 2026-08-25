'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Category } from '@/types/product';

interface HeaderProps {
  initialCategories?: Category[];
}

export function Header({ initialCategories }: HeaderProps) {
  const { totalCount, setIsCartOpen } = useCart();
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Only fetch once on mount if no initial categories were provided
    if (categories.length === 0) {
      fetch('/api/categories')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
          }
        })
        .catch(() => {});
    }
  }, []); // Run ONCE on mount

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#2B0A1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with Official Graphic */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E6007E]/50 group-hover:border-[#FF4FA0] transition-colors flex-shrink-0">
            <Image src="/logo.png" alt="VIC ROYAL BEAUTY Logo" fill className="object-cover" priority />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            VIC ROYAL <span className="text-[#E6007E]">BEAUTY</span>
          </span>
        </Link>

        {/* Desktop Category Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-200 hover:text-[#FF4FA0] transition-colors">
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="text-sm font-medium text-gray-300 hover:text-[#FF4FA0] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Cart Icon Badge & Mobile Menu Trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-[#2B0A1F] text-white hover:bg-[#E6007E] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E6007E] text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-[#2B0A1F] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-white hover:text-[#FF4FA0]"
          >
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-300 hover:text-[#FF4FA0]"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
