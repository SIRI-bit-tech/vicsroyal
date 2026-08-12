'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '../../types/product';
import { formatNaira } from '../../lib/format-currency';
import { useCart } from '../../context/cart-context';
import { ShoppingBag, Plus, Minus, CheckCircle, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailProps) {
  const { addItem, setIsCartOpen } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '/seed/products/wig-1.jpg');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-[#2B0A1F]/30 border border-[#2B0A1F]">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img ? 'border-[#E6007E]' : 'border-[#2B0A1F] opacity-60'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#2B0A1F] text-[#FF4FA0] text-xs font-extrabold uppercase tracking-wider mb-3">
              {product.stockStatus.replace('_', ' ')}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{product.name}</h1>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black text-[#FF4FA0]">{formatNaira(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-gray-500 line-through">{formatNaira(product.compareAtPrice)}</span>
              )}
            </div>
          </div>

          <div className="border-y border-[#2B0A1F] py-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-[#2B0A1F] rounded-xl bg-[#0A0A0A] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-2xl hover:opacity-95 transition-opacity"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Shopping Cart ({formatNaira(product.price * quantity)})
            </motion.button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2B0A1F]/50 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E6007E]" />
              <span>100% Virgin Hair Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#E6007E]" />
              <span>WhatsApp Direct Support & Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
