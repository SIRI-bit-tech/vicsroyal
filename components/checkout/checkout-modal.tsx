'use client';

import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { buildWhatsAppOrderUrl } from '@/lib/whatsapp';
import { DEFAULT_WHATSAPP_NUMBER } from '@/constants';
import { ReviewStep } from './review-step';

interface CheckoutModalProps {
  onClose: () => void;
}

export function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { items, subtotal, clearCart, setIsCartOpen } = useCart();
  const [step, setStep] = useState<'form' | 'review'>('form');

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) {
      setError('Please fill in your name, phone number, and delivery address.');
      return;
    }
    setError('');
    setStep('review');
  };

  const handleConfirmAndSend = async () => {
    setIsSubmitting(true);
    setError('');

    const snapshotItems = items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      imageUrl: i.product.images[0] || '/seed/products/hair-product-1-1.jpg',
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phoneNumber,
          deliveryAddress,
          promoCode: promoCode.trim() || null,
          notes,
          items: snapshotItems,
          totalAmount: subtotal,
        }),
      });

      if (!res.ok) throw new Error('Order creation failed');

      const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      const waUrl = buildWhatsAppOrderUrl({
        customerName,
        phoneNumber,
        deliveryAddress,
        notes,
        promoCode: promoCode.trim() || null,
        items: snapshotItems,
        totalAmount: subtotal,
        baseUrl,
        adminWhatsAppNumber: adminPhone,
      });

      clearCart();
      setIsCartOpen(false);
      onClose();
      window.open(waUrl, '_blank');
    } catch (err: any) {
      console.error(err);
      setError('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0A0A0A] border-2 border-[#2B0A1F] rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#2B0A1F] text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">Delivery Details</h2>
            <p className="text-xs sm:text-sm text-gray-400 mb-6">Enter details for order verification & WhatsApp hand-off.</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleNextToReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Full Name *</label>
                <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Chidinma Okafor" className="w-full px-4 py-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1">WhatsApp Phone Number *</label>
                <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g. 08012345678" className="w-full px-4 py-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1">Delivery Address *</label>
                <textarea required rows={2} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Street address, city, state" className="w-full px-4 py-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-[#FF4FA0]" /> Promo / Discount Code</span>
                  <span className="text-[11px] font-normal text-gray-400">Optional</span>
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. ROYAL15 (optional)"
                  className="w-full px-4 py-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white uppercase placeholder:normal-case focus:outline-none focus:border-[#FF4FA0]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1 flex items-center justify-between">
                  <span>Order Notes</span>
                  <span className="text-[11px] font-normal text-gray-400">Optional</span>
                </label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Cap size or length preference" className="w-full px-4 py-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
              </div>

              <button type="submit" className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-sm sm:text-base shadow-xl">
                Review Order Summary →
              </button>
            </form>
          </div>
        ) : (
          <ReviewStep
            customerName={customerName}
            phoneNumber={phoneNumber}
            deliveryAddress={deliveryAddress}
            notes={notes}
            promoCode={promoCode}
            items={items}
            subtotal={subtotal}
            isSubmitting={isSubmitting}
            onBack={() => setStep('form')}
            onConfirm={handleConfirmAndSend}
          />
        )}
      </div>
    </div>
  );
}
