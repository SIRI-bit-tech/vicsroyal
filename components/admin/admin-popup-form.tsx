'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Eye, Save, Check, Upload, X, Sparkles, ArrowRight } from 'lucide-react';
import { MarketingPromos } from '@/types/promo';

interface PopupFormProps {
  initialData: MarketingPromos;
  onSave: (data: Partial<MarketingPromos>) => Promise<void>;
}

export function AdminPopupForm({ initialData, onSave }: PopupFormProps) {
  const [enabled, setEnabled] = useState(initialData.popupEnabled ?? false);
  const [heading, setHeading] = useState(initialData.popupHeading ?? 'EXCLUSIVE FLASH SALE ✨');
  const [subheading, setSubheading] = useState(initialData.popupSubheading ?? 'Enjoy exclusive savings on 100% Raw Virgin Human Hair.');
  const [discountTag, setDiscountTag] = useState(initialData.popupDiscountTag ?? 'UP TO 20% OFF');
  const [imageUrl, setImageUrl] = useState(initialData.popupImageUrl ?? '/hero/hero-1.png');
  const [ctaText, setCtaText] = useState(initialData.popupCtaText ?? 'Claim Discount Now');
  const [ctaLink, setCtaLink] = useState(initialData.popupCtaLink ?? '/category/wigs');
  const [expiresAt, setExpiresAt] = useState(
    initialData.popupExpiresAt ? new Date(initialData.popupExpiresAt).toISOString().slice(0, 16) : ''
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) setImageUrl(URL.createObjectURL(files[0]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      popupEnabled: enabled, popupHeading: heading, popupSubheading: subheading,
      popupDiscountTag: discountTag, popupImageUrl: imageUrl, popupCtaText: ctaText,
      popupCtaLink: ctaLink, popupExpiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-6 shadow-xl text-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#2B0A1F]">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E6007E]" /> Storefront Discount Popup Banner (Ad Modal)
          </h3>
          <p className="text-gray-400 mt-0.5">Pops up immediately when visitors land on your hair storefront with a discount deal & CTA.</p>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setShowPreviewModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2B0A1F] hover:bg-[#FF4FA0] text-white font-bold transition-colors">
            <Eye className="w-3.5 h-3.5" /> Test Preview
          </button>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="w-4 h-4 rounded text-[#E6007E] focus:ring-0 bg-[#2B0A1F]" />
            <span className="font-bold text-white">Enable Popup</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 font-bold mb-1">Popup Main Headline</label>
          <input type="text" required value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
        </div>
        <div>
          <label className="block text-gray-300 font-bold mb-1">Discount Badge Tag</label>
          <input type="text" value={discountTag} onChange={(e) => setDiscountTag(e.target.value)} placeholder="e.g. UP TO 25% OFF" className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 font-bold mb-1">Subheading / Description</label>
        <textarea rows={2} value={subheading} onChange={(e) => setSubheading(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
      </div>

      <div>
        <label className="block text-gray-300 font-bold mb-1">Ad Graphic / Product Photo</label>
        {imageUrl ? (
          <div className="relative h-32 w-full max-w-sm rounded-2xl overflow-hidden border-2 border-[#E6007E] bg-[#2B0A1F]">
            <Image src={imageUrl} alt="Ad Preview" fill className="object-cover" />
            <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:text-red-400"><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#2B0A1F] hover:border-[#E6007E] rounded-2xl p-4 text-center bg-[#2B0A1F]/20 cursor-pointer max-w-sm">
            <Upload className="w-6 h-6 text-[#FF4FA0] mx-auto mb-1" /><p className="text-xs font-bold text-white">Upload Popup Graphic</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 font-bold mb-1">Action Button Text</label>
          <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
        </div>
        <div>
          <label className="block text-gray-300 font-bold mb-1">Destination Target Link</label>
          <input type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-[#2B0A1F]">
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-black text-xs shadow-xl hover:opacity-90 transition-all disabled:opacity-50">
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Popup Settings'}</span>
        </button>
      </div>

      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0A0A0A] border-2 border-[#E6007E] rounded-3xl overflow-hidden shadow-2xl">
            <button type="button" onClick={() => setShowPreviewModal(false)} className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 hover:bg-[#E6007E] text-white"><X className="w-4 h-4" /></button>
            <div className="relative h-40 w-full bg-[#2B0A1F]">
              <Image src={imageUrl || '/hero/hero-1.png'} alt="" fill className="object-cover" />
              {discountTag && <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#E6007E] text-white text-xs font-black">{discountTag}</span>}
            </div>
            <div className="p-6 space-y-3 text-center">
              <h3 className="text-xl font-black text-white">{heading}</h3>
              <p className="text-xs text-gray-300">{subheading}</p>
              <div className="pt-2">
                <span className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-xs shadow-xl">
                  {ctaText} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
