'use client';

import React from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { CartItem } from '@/types/order';
import { formatNaira } from '@/lib/format-currency';

interface ReviewStepProps {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export function ReviewStep({
  customerName,
  phoneNumber,
  deliveryAddress,
  notes,
  items,
  subtotal,
  isSubmitting,
  onBack,
  onConfirm,
}: ReviewStepProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-1 text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl sm:text-2xl font-black text-white">Review Order Summary</h2>
      </div>

      <p className="text-xs sm:text-sm text-gray-400 mb-4">
        Confirm your order details before transferring to WhatsApp.
      </p>

      <div className="p-4 rounded-2xl bg-[#2B0A1F]/30 border border-[#2B0A1F] space-y-3 mb-6">
        <div className="text-xs space-y-1">
          <p className="text-gray-400"><strong className="text-white">Customer:</strong> {customerName} ({phoneNumber})</p>
          <p className="text-gray-400"><strong className="text-white">Address:</strong> {deliveryAddress}</p>
          {notes && <p className="text-gray-400"><strong className="text-white">Note:</strong> {notes}</p>}
        </div>

        <div className="border-t border-[#2B0A1F] pt-3 space-y-2 max-h-40 overflow-y-auto">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between text-xs">
              <span className="text-white font-medium">{quantity}× {product.name}</span>
              <span className="text-[#FF4FA0] font-bold">{formatNaira(product.price * quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#2B0A1F] pt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-white">Subtotal</span>
          <span className="text-lg font-black text-[#FF4FA0]">{formatNaira(subtotal)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition-opacity disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          {isSubmitting ? 'Recording Order...' : 'Confirm & Send to WhatsApp'}
        </button>

        <button onClick={onBack} className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-white">
          Back to Edit Information
        </button>
      </div>
    </div>
  );
}
