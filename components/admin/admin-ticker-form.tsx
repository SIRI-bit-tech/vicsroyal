'use client';

import React, { useState } from 'react';
import { Sparkles, Tag, Clock, ArrowRight, Save, Check } from 'lucide-react';
import { MarketingPromos } from '@/types/promo';

interface TickerFormProps {
  initialData: MarketingPromos;
  onSave: (data: Partial<MarketingPromos>) => Promise<void>;
}

export function AdminTickerForm({ initialData, onSave }: TickerFormProps) {
  const [enabled, setEnabled] = useState(initialData.tickerEnabled ?? true);
  const [text, setText] = useState(initialData.tickerText ?? '');
  const [code, setCode] = useState(initialData.tickerDiscountCode ?? '');
  const [expiresAt, setExpiresAt] = useState(
    initialData.tickerExpiresAt ? new Date(initialData.tickerExpiresAt).toISOString().slice(0, 16) : ''
  );
  const [ctaLink, setCtaLink] = useState(initialData.tickerCtaLink ?? '/category/wigs');
  const [ctaText, setCtaText] = useState(initialData.tickerCtaText ?? 'Shop Now');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      tickerEnabled: enabled,
      tickerText: text,
      tickerDiscountCode: code || null,
      tickerExpiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      tickerCtaLink: ctaLink,
      tickerCtaText: ctaText,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const setQuickExpiry = (hours: number) => {
    const d = new Date(Date.now() + hours * 60 * 60 * 1000);
    setExpiresAt(d.toISOString().slice(0, 16));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-6 shadow-xl text-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#2B0A1F]">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF4FA0]" /> Sales Scroll Ticker (Announcement Bar)
          </h3>
          <p className="text-gray-400 mt-0.5">Top-of-page promotional marquee with optional discount code & countdown timer.</p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-[#E6007E] focus:ring-0 bg-[#2B0A1F]"
          />
          <span className="font-bold text-white">Enable Ticker</span>
        </label>
      </div>

      {/* Live Preview */}
      <div>
        <label className="block text-gray-400 font-bold mb-1.5">Live Storefront Preview</label>
        <div className="p-3 rounded-2xl bg-gradient-to-r from-[#2B0A1F] via-[#E6007E] to-[#2B0A1F] text-white flex flex-wrap items-center justify-between gap-2 shadow-inner border border-[#FF4FA0]/30">
          <div className="flex items-center gap-2 font-bold truncate">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse flex-shrink-0" />
            <span>{text || '⚡ FLASH PROMO: Get 15% OFF all Wigs!'}</span>
          </div>
          <div className="flex items-center gap-2">
            {code && (
              <span className="px-2 py-0.5 rounded-full bg-black/40 text-amber-300 font-mono font-bold text-[10px]">
                CODE: {code}
              </span>
            )}
            {expiresAt && (
              <span className="px-2 py-0.5 rounded-full bg-black/50 text-white font-mono text-[10px] flex items-center gap-1 border border-amber-400/30">
                <Clock className="w-3 h-3 text-amber-400" /> Countdown Active
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-white text-[#2B0A1F] font-black text-[11px]">
              {ctaText} →
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 font-bold mb-1">Promotional Text Message</label>
          <input
            type="text"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. ⚡ FLASH SALE: 20% OFF ALL VIRGIN HAIR BUNDLES!"
            className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white focus:border-[#E6007E] outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-bold mb-1">Promo Discount Code (Optional)</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. VIC20"
            className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white font-mono uppercase focus:border-[#E6007E] outline-none"
          />
        </div>
      </div>

      {/* Countdown Timer Expiry */}
      <div className="space-y-2">
        <label className="block text-gray-300 font-bold">Expiration Date & Time (Optional Countdown)</label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white focus:border-[#E6007E] outline-none"
          />
          <button
            type="button"
            onClick={() => setQuickExpiry(24)}
            className="px-3 py-2 rounded-xl bg-[#2B0A1F] hover:bg-[#E6007E] text-white font-semibold transition-colors"
          >
            +24 Hours Flash
          </button>
          <button
            type="button"
            onClick={() => setQuickExpiry(72)}
            className="px-3 py-2 rounded-xl bg-[#2B0A1F] hover:bg-[#E6007E] text-white font-semibold transition-colors"
          >
            +3 Days
          </button>
          <button
            type="button"
            onClick={() => setExpiresAt('')}
            className="px-3 py-2 rounded-xl bg-[#2B0A1F]/60 text-gray-400 hover:text-red-400 transition-colors"
          >
            Clear Expiry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 font-bold mb-1">Button CTA Text</label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 font-bold mb-1">Destination Target Link</label>
          <input
            type="text"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-[#2B0A1F]">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-black text-xs shadow-xl hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Ticker Settings'}</span>
        </button>
      </div>
    </form>
  );
}
