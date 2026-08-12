'use client';

import React from 'react';
import Image from 'next/image';
import { Testimonial } from '../../types/testimonial';
import { Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#E6007E] uppercase tracking-widest block mb-2">
            Client Love & Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            What Our <span className="text-[#FF4FA0]">Queens</span> Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative p-8 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] flex flex-col justify-between shadow-2xl hover:border-[#E6007E]/40 transition-colors"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#2B0A1F]" />

              <div className="mb-6">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E6007E] text-[#E6007E]" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  &quot;{t.content}&quot;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#2B0A1F]">
                {t.imageUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#E6007E] flex-shrink-0">
                    <Image src={t.imageUrl} alt={t.clientName} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#2B0A1F] border-2 border-[#E6007E] flex items-center justify-center text-[#FF4FA0] font-bold text-sm flex-shrink-0">
                    {t.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">{t.clientName}</h4>
                  <span className="text-xs text-gray-500">Verified Purchaser</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
