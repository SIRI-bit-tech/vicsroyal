'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Product } from '../../types/product';
import { ProductCard } from '../product/product-card';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedProps {
  products: Product[];
}

export function FeaturedSection({ products }: FeaturedProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-[#2B0A1F]/30 border-y border-[#2B0A1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#FF4FA0] font-bold text-xs tracking-widest uppercase mb-2">
              <Flame className="w-4 h-4" /> Curated Selection
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Featured <span className="text-[#FF4FA0]">Products</span>
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => emblaApi && emblaApi.scrollPrev()}
              className="p-3 rounded-full bg-[#0A0A0A] text-white border border-[#2B0A1F] hover:bg-[#E6007E] transition-colors"
              aria-label="Previous Featured Product"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => emblaApi && emblaApi.scrollNext()}
              className="p-3 rounded-full bg-[#0A0A0A] text-white border border-[#2B0A1F] hover:bg-[#E6007E] transition-colors"
              aria-label="Next Featured Product"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {products.map((product) => (
              <div key={product.id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
