'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketingPromos } from '@/types/promo';

const DISMISS_KEY = 'vic_royal_promo_popup_dismissed_v1';

export function PromoPopupModal() {
  const [promo, setPromo] = useState<MarketingPromos | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = typeof window !== 'undefined' && sessionStorage.getItem(DISMISS_KEY);
    if (isDismissed) return;

    fetch('/api/promos')
      .then((r) => r.json())
      .then((data: MarketingPromos) => {
        if (!data || !data.popupEnabled) return;

        // Check if expired
        if (data.popupExpiresAt) {
          const expireTime = new Date(data.popupExpiresAt).getTime();
          if (expireTime < Date.now()) return;
        }

        setPromo(data);
        // Show after 1.2s delay for seamless entrance
        const timer = setTimeout(() => setIsOpen(true), 1200);
        return () => clearTimeout(timer);
      })
      .catch(() => {});
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    }
  };

  if (!isOpen || !promo) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[#0A0A0A] border-2 border-[#E6007E] rounded-3xl overflow-hidden shadow-2xl z-10"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 hover:bg-[#E6007E] text-white transition-colors cursor-pointer"
            aria-label="Close promotion popup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner Image with Discount Tag */}
          <div className="relative h-48 w-full bg-[#2B0A1F]">
            <Image
              src={promo.popupImageUrl || '/hero/hero-1.png'}
              alt="Special Promotion"
              fill
              className="object-cover brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            {promo.popupDiscountTag && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6007E] text-white text-xs font-black shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{promo.popupDiscountTag}</span>
              </div>
            )}
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-4 text-center">
            <h3 className="text-xl font-black text-white leading-tight">
              {promo.popupHeading}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {promo.popupSubheading}
            </p>

            <div className="pt-2">
              <Link
                href={promo.popupCtaLink || '/category/wigs'}
                onClick={handleClose}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E6007E] via-[#FF4FA0] to-[#E6007E] text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-all group"
              >
                <span>{promo.popupCtaText || 'Claim Discount Now'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-[11px] text-gray-500">
              Limited time promotional offer • Orders processed directly via WhatsApp
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
