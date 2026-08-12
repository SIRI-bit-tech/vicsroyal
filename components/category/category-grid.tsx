'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '../product/product-card';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface CategoryGridProps {
  categoryName: string;
  initialProducts: Product[];
}

export function CategoryGrid({ categoryName, initialProducts }: CategoryGridProps) {
  const [sortOption, setSortOption] = useState<'newest' | 'price_low' | 'price_high' | 'new_arrivals'>('newest');

  let processedProducts = [...initialProducts];

  if (sortOption === 'new_arrivals') {
    processedProducts = processedProducts.filter((p) => p.isNewArrival);
  }

  processedProducts.sort((a, b) => {
    const priceA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price));
    const priceB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price));

    if (sortOption === 'price_low') {
      return priceA - priceB;
    }
    if (sortOption === 'price_high') {
      return priceB - priceA;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-[#2B0A1F] gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{categoryName}</h1>
          <p className="text-sm text-gray-400 mt-1">Showing {processedProducts.length} items</p>
        </div>

        {/* Live Filter & Sort Controls */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-[#E6007E]" />
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="appearance-none px-6 py-3 pr-10 rounded-full bg-[#0A0A0A] border-2 border-[#E6007E] text-white text-sm font-bold shadow-lg focus:outline-none focus:border-[#FF4FA0] cursor-pointer transition-colors"
            >
              <option value="newest" className="bg-[#0A0A0A] text-white">Newest Arrivals</option>
              <option value="price_low" className="bg-[#0A0A0A] text-white">Price: Low to High</option>
              <option value="price_high" className="bg-[#0A0A0A] text-white">Price: High to Low</option>
              <option value="new_arrivals" className="bg-[#0A0A0A] text-white">New Arrivals Only ✨</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4FA0] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {processedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 bg-[#0A0A0A] border border-[#2B0A1F] rounded-2xl">
          <p className="text-lg font-bold text-white">No products found matching filter.</p>
          <p className="text-xs text-gray-500 mt-1">Try selecting &quot;Newest Arrivals&quot; or another price sort option.</p>
        </div>
      )}
    </div>
  );
}
