'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { formatNaira } from '@/lib/format-currency';
import { useCart } from '@/context/cart-context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, setIsCartOpen } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setIsCartOpen(true);
  };

  const mainImage = product.images[0] || '/seed/products/hair-product-1-1.jpg';
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col h-full rounded-2xl bg-[#0A0A0A] border border-[#2B0A1F] overflow-hidden hover:border-[#E6007E]/60 transition-all duration-300 shadow-xl"
    >
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] w-full overflow-hidden bg-[#2B0A1F]/40">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md animate-pulse">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 rounded-full bg-[#FF4FA0] text-white font-black text-[10px] tracking-wider uppercase shadow-md">
              New Arrival
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-1 rounded-full bg-[#E6007E] text-white font-black text-[10px] tracking-wider uppercase shadow-md">
              Best Seller
            </span>
          )}
          {product.isFeatured && !product.isBestSeller && !product.isNewArrival && !hasDiscount && (
            <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md">
              Featured
            </span>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/product/${product.slug}`} className="group-hover:text-[#FF4FA0] transition-colors">
          <h3 className="text-base font-bold text-white line-clamp-1 mb-1">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">{product.description}</p>

        {/* Pricing & Cart Action */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2B0A1F]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-[#FF4FA0]">
                {formatNaira(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-500 line-through">
                  {formatNaira(product.compareAtPrice!)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="text-[10px] font-bold text-emerald-400">
                Save {formatNaira(product.compareAtPrice! - product.price)}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
          >
            <ShoppingBag className="w-4 h-4" />
            Add
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
