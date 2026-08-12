'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { MoveUpRight, Sparkles } from 'lucide-react';
import { Product } from '../../types/product';
import { formatNaira } from '../../lib/format-currency';

interface AsymmetricGridProps {
  products: Product[];
}

export function AsymmetricGridSection({ products }: AsymmetricGridProps) {
  const displayProducts = products.slice(0, 4);
  if (displayProducts.length === 0) return null;

  return (
    <section className="py-16 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-[#E6007E] font-bold text-xs tracking-widest uppercase mb-2">
          <Sparkles className="w-4 h-4" /> Signature Craftsmanship
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          Luxury <span className="text-[#FF4FA0]">Showcase Grid</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 overflow-hidden px-4 lg:pb-5 pb-2">
        {displayProducts.map((product, index) => {
          let colSpanClass = 'sm:col-span-6 col-span-12';
          if (index === 0) {
            colSpanClass = 'sm:col-span-5 col-span-12';
          } else if (index === 1) {
            colSpanClass = 'sm:col-span-7 col-span-12';
          } else if (index === displayProducts.length - 2) {
            colSpanClass = 'sm:col-span-7 col-span-12';
          } else if (index === displayProducts.length - 1) {
            colSpanClass = 'sm:col-span-5 col-span-12';
          }

          const img = product.images[0] || '/seed/products/hair-product-1-1.jpg';

          return (
            <motion.article
              key={product.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ ease: 'easeOut', duration: 0.5 }}
              viewport={{ once: false }}
              className={`relative group ${colSpanClass} h-[380px] rounded-2xl overflow-hidden border border-[#2B0A1F] bg-[#0A0A0A]`}
            >
              <Link href={`/product/${product.slug}`} className="block w-full h-full">
                <Image
                  src={img}
                  alt={product.name}
                  width={1200}
                  height={600}
                  className="h-full w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />

                <div className="absolute lg:bottom-4 bottom-2 text-white w-full p-4 flex justify-between items-center">
                  <div>
                    <h3 className="lg:text-lg text-sm bg-[#0A0A0A]/90 text-white font-bold rounded-xl p-2 px-4 border border-[#2B0A1F] backdrop-blur-md">
                      {product.name}
                    </h3>
                    <span className="inline-block mt-1 text-xs text-[#FF4FA0] font-extrabold px-3 py-1 bg-[#2B0A1F]/90 rounded-lg">
                      {formatNaira(product.price)}
                    </span>
                  </div>
                  <div className="lg:w-12 w-10 lg:h-12 h-10 text-white grid place-content-center rounded-full bg-[#E6007E] group-hover:bg-[#FF4FA0] transition-colors shadow-lg">
                    <MoveUpRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
