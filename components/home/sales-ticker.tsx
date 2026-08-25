'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { MarketingPromos } from '@/types/promo';

interface SalesTickerProps {
  initialData?: MarketingPromos | null;
}

export function SalesTicker({ initialData }: SalesTickerProps) {
  const [promo, setPromo] = useState<MarketingPromos | null>(initialData || null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!initialData) {
      fetch('/api/promos')
        .then((r) => r.json())
        .then((d) => setPromo(d))
        .catch(() => {});
    }
  }, [initialData]);

  // Live Countdown calculation
  useEffect(() => {
    if (!promo?.tickerExpiresAt) {
      setTimeLeft('');
      setIsExpired(false);
      return;
    }

    const target = new Date(promo.tickerExpiresAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance <= 0) {
        setIsExpired(true);
        setTimeLeft('EXPIRED');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const formatted = `${days > 0 ? `${days}d ` : ''}${hours.toString().padStart(2, '0')}h ${minutes
        .toString()
        .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

      setTimeLeft(formatted);
      setIsExpired(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [promo?.tickerExpiresAt]);

  if (!promo || !promo.tickerEnabled || isExpired) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#2B0A1F] via-[#E6007E] to-[#2B0A1F] text-white py-2 px-4 border-b border-[#FF4FA0]/30 overflow-hidden relative shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Sales Message */}
        <div className="flex items-center gap-2 font-extrabold tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse flex-shrink-0" />
          <span>{promo.tickerText}</span>
        </div>

        {/* Discount Code & Timer & CTA */}
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          {promo.tickerDiscountCode && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 border border-white/20 font-mono font-bold text-amber-300">
              <Tag className="w-3 h-3" />
              <span>CODE: {promo.tickerDiscountCode}</span>
            </div>
          )}

          {timeLeft && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/50 text-white font-mono font-bold text-[11px] border border-amber-400/40">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Ends in: {timeLeft}</span>
            </div>
          )}

          <Link
            href={promo.tickerCtaLink || '/category/wigs'}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#2B0A1F] font-black text-xs hover:bg-[#FF4FA0] hover:text-white transition-all shadow-sm group"
          >
            <span>{promo.tickerCtaText || 'Shop Now'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
