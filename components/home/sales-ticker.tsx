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
      const formatted = (days > 0 ? days + 'd ' : '') +
        String(hours).padStart(2,'0') + 'h ' +
        String(minutes).padStart(2,'0') + 'm ' +
        String(seconds).padStart(2,'0') + 's';
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

  const segment = (
    <span className="flex items-center gap-6 pr-16 whitespace-nowrap">
      <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
      <span className="font-extrabold tracking-wide">{promo.tickerText}</span>
      <span className="text-[#FF4FA0] font-black">&#x2736;</span>
    </span>
  );

  return (
    <>
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 24s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>

      <div
        className="w-full bg-gradient-to-r from-[#2B0A1F] via-[#E6007E] to-[#2B0A1F] text-white border-b border-[#FF4FA0]/30 shadow-md overflow-hidden relative"
        style={{ height: '36px' }}
      >
        <div className="absolute inset-0 flex items-center overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #6B003F, transparent)' }}
          />
          <div
            className="absolute right-0 top-0 h-full w-52 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #6B003F, transparent)' }}
          />
          <div className="ticker-track flex items-center text-xs" aria-live="off">
            {Array.from({ length: 6 }).map((_, i) => (
              <React.Fragment key={i}>{segment}</React.Fragment>
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <React.Fragment key={'d' + i}>{segment}</React.Fragment>
            ))}
          </div>
        </div>

        <div className="absolute right-0 top-0 h-full flex items-center gap-2 pr-3 z-20">
          {promo.tickerDiscountCode && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 border border-amber-400/50 font-mono font-bold text-amber-300 text-[11px] whitespace-nowrap backdrop-blur-sm">
              <Tag className="w-3 h-3 flex-shrink-0" />
              <span>CODE: {promo.tickerDiscountCode}</span>
            </div>
          )}
          {timeLeft && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 text-white font-mono font-bold text-[11px] border border-amber-400/40 whitespace-nowrap backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin flex-shrink-0" />
              <span>Ends in: {timeLeft}</span>
            </div>
          )}
          <Link
            href={promo.tickerCtaLink || '/category/wigs'}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#2B0A1F] font-black text-xs hover:bg-[#FF4FA0] hover:text-white transition-all shadow-sm group whitespace-nowrap"
          >
            <span>{promo.tickerCtaText || 'Shop Now'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </>
  );
}
