'use client';

import React from 'react';
import { Product } from '../../types/product';
import { ProductCard } from '../product/product-card';
import { Sparkles } from 'lucide-react';

interface BestSellersProps {
  products: Product[];
}

export function BestSellersSection({ products }: BestSellersProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#E6007E] font-bold text-xs tracking-widest uppercase mb-2">
              <Sparkles className="w-4 h-4" /> Customer Favorites
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Best Sellers <span className="text-[#E6007E]">Collection</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-md mt-2 md:mt-0">
            Our most requested luxury wigs, bundles, and closures — crafted for seamless installation and longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
