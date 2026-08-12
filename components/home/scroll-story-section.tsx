'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useScroll, useTransform, motion } from 'motion/react';
import { Product } from '../../types/product';
import { Sparkles } from 'lucide-react';

interface ScrollStoryProps {
  products: Product[];
}

export function ScrollStorySection({ products }: ScrollStoryProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const featuredImages = products.slice(0, 4).map((p, i) => ({
    id: p.id,
    name: p.name,
    img: p.images[0] || `/seed/products/hair-product-${i + 1}-1.jpg`,
  }));

  return (
    <div ref={container} className="relative h-[200vh] bg-[#0A0A0A]">
      <ScrollSection1 scrollYProgress={scrollYProgress} />
      <ScrollSection2 scrollYProgress={scrollYProgress} items={featuredImages} />
    </div>
  );
}

function ScrollSection1({ scrollYProgress }: { scrollYProgress: any }) {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <motion.section
      style={{ scale, rotate }}
      className="sticky top-0 h-screen bg-gradient-to-t from-[#2B0A1F] to-[#0A0A0A] flex flex-col items-center justify-center text-white text-center px-4 border-b border-[#2B0A1F]"
    >
      <div className="flex items-center gap-2 text-[#FF4FA0] font-bold text-xs tracking-widest uppercase mb-4">
        <Sparkles className="w-4 h-4" /> Seamless Luxury Melt
      </div>
      <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl">
        Unrivaled <span className="text-[#E6007E]">Virgin Hair</span> Quality & Grace
      </h2>
      <p className="text-gray-300 text-base sm:text-xl font-medium mt-6 max-w-xl">
        Scroll to explore our double drawn raw bundles and invisible HD lace closures.
      </p>
    </motion.section>
  );
}

function ScrollSection2({ scrollYProgress, items }: { scrollYProgress: any; items: any[] }) {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);

  return (
    <motion.section
      style={{ scale, rotate }}
      className="relative h-screen bg-[#0A0A0A] text-white flex flex-col justify-center py-12"
    >
      <div className="max-w-7xl mx-auto px-4 w-full">
        <h3 className="text-3xl sm:text-5xl font-black py-8 tracking-tight">
          Handcrafted <span className="text-[#FF4FA0]">Collections</span>
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#2B0A1F] border border-[#2B0A1F]">
              <Image
                src={item.img}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent p-4 flex items-end">
                <span className="text-xs font-bold text-white bg-[#0A0A0A]/80 px-3 py-1.5 rounded-lg border border-[#2B0A1F] truncate">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
