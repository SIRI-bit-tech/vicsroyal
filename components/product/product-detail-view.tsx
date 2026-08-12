'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, CheckCircle, ShieldCheck } from 'lucide-react';
import { Product } from '@/types/product';
import { formatNaira } from '@/lib/format-currency';
import { useCart } from '@/context/cart-context';

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem, setIsCartOpen } = useCart();

  const productImages = product.images && product.images.length > 0
    ? product.images
    : ['/seed/products/hair-product-1-1.jpg'];

  const [selectedImage, setSelectedImage] = useState(productImages[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Images Gallery Panel */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-[#2B0A1F]/30 border border-[#2B0A1F] shadow-2xl">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#FF4FA0] text-white font-black text-xs uppercase shadow-lg">
                New Arrival
              </span>
            )}
          </div>

          {/* Secondary Gallery Photos Below Main Image */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-[#E6007E] scale-105 shadow-lg' : 'border-[#2B0A1F] opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Panel */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#FF4FA0] tracking-widest uppercase">VIC ROYAL BEAUTY</span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-extrabold text-[#FF4FA0]">{formatNaira(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-gray-500 line-through">{formatNaira(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line border-t border-b border-[#2B0A1F] py-6">
            {product.description}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[#2B0A1F] rounded-xl bg-[#0A0A0A] p-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-white font-bold text-lg hover:bg-[#2B0A1F] rounded-lg">-</button>
              <span className="px-4 text-sm font-bold text-white">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-white font-bold text-lg hover:bg-[#2B0A1F] rounded-lg">+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Shopping Cart
            </button>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#2B0A1F] text-xs text-gray-400">
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#10B981]" /><span className="text-white font-semibold">100% Virgin Human Hair Guaranteed</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#FF4FA0]" /><span className="text-white font-semibold">Direct WhatsApp Concierge & Secure Hand-off</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
