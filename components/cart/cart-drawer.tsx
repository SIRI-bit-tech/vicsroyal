'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatNaira } from '@/lib/format-currency';
import { CheckoutModal } from '../checkout/checkout-modal';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <div className="w-full sm:w-screen sm:max-w-md bg-[#0A0A0A] border-l border-[#2B0A1F] flex flex-col shadow-2xl h-full">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[#2B0A1F] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#E6007E]" />
                <h2 className="text-base sm:text-lg font-extrabold text-white">Shopping Cart</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-[#2B0A1F] text-gray-400 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Items Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {items.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ShoppingBag className="w-12 h-12 text-[#2B0A1F] mx-auto mb-3" />
                  <p className="text-base font-semibold text-white">Your cart is empty</p>
                  <p className="text-xs text-gray-500 mt-1">Explore our wigs and hair bundles to get started.</p>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 sm:gap-4 p-3 rounded-2xl bg-[#2B0A1F]/30 border border-[#2B0A1F]">
                    <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-[#2B0A1F] flex-shrink-0">
                      <Image
                        src={product.images[0] || '/seed/products/hair-product-1-1.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{product.name}</h4>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="text-gray-500 hover:text-red-400 p-1 flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold text-[#FF4FA0]">
                          {formatNaira(product.price)}
                        </span>
                      </div>

                      {/* Touch Quantity Selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-[#2B0A1F] rounded-lg bg-[#0A0A0A]">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white active:bg-[#2B0A1F]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 sm:px-3 text-xs font-bold text-white min-w-[20px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white active:bg-[#2B0A1F]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Mobile Footer Bar */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-[#2B0A1F] bg-[#0A0A0A] space-y-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-gray-400">Subtotal</span>
                  <span className="text-lg sm:text-xl font-black text-[#FF4FA0]">{formatNaira(subtotal)}</span>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:opacity-95 active:scale-[0.99] transition-all"
                >
                  Proceed to Order <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}
    </>
  );
}
