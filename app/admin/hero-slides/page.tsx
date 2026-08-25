'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, Loader2, Upload, X, LayoutGrid, Sparkles, Megaphone } from 'lucide-react';
import { HeroSlide } from '@/types/hero';
import { MarketingPromos } from '@/types/promo';
import { AdminTickerForm } from '@/components/admin/admin-ticker-form';
import { AdminPopupForm } from '@/components/admin/admin-popup-form';

export default function AdminHeroSlidesPage() {
  const [activeTab, setActiveTab] = useState<'slides' | 'ticker' | 'popup'>('slides');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [promos, setPromos] = useState<MarketingPromos | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('Shop Now');
  const [ctaLink, setCtaLink] = useState('/category/wigs');
  const [sortOrder, setSortOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSlides, resPromos] = await Promise.all([
        fetch('/api/admin/hero-slides'),
        fetch('/api/admin/promos'),
      ]);
      const sData = await resSlides.json();
      const pData = await resPromos.json();
      if (Array.isArray(sData)) setSlides(sData);
      if (pData && !pData.error) setPromos(pData);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenCreate = () => {
    setEditingSlide(null); setHeading(''); setSubheading(''); setImageUrl('/hero/hero-1.png');
    setCtaText('Shop Wigs'); setCtaLink('/category/wigs'); setSortOrder('1'); setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (s: HeroSlide) => {
    setEditingSlide(s); setHeading(s.heading); setSubheading(s.subheading); setImageUrl(s.imageUrl);
    setCtaText(s.ctaText); setCtaLink(s.ctaLink); setSortOrder(String(s.sortOrder)); setIsActive(s.isActive);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hero slide?')) return;
    await fetch(`/api/admin/hero-slides?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingSlide?.id, heading, subheading, imageUrl: imageUrl || '/hero/hero-1.png',
      ctaText, ctaLink, sortOrder: Number(sortOrder), isActive,
    };
    await fetch('/api/admin/hero-slides', {
      method: editingSlide ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setShowModal(false); fetchData();
  };

  const handleSavePromos = async (updated: Partial<MarketingPromos>) => {
    const res = await fetch('/api/admin/promos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...promos, ...updated }),
    });
    const data = await res.json();
    if (data && !data.error) setPromos(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Marketing & Banners</h1>
          <p className="text-xs text-gray-400 mt-1">Configure homepage carousel slides, sales scroll ticker, and pop-up discount banners.</p>
        </div>
        {activeTab === 'slides' && (
          <button onClick={handleOpenCreate} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-xs shadow-xl cursor-pointer">
            <Plus className="w-4 h-4" /> Add Hero Slide
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0A0A0A] border border-[#2B0A1F] w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'slides' ? 'bg-[#E6007E] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <LayoutGrid className="w-4 h-4" /> Hero Slides ({slides.length})
        </button>
        <button
          onClick={() => setActiveTab('ticker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'ticker' ? 'bg-[#E6007E] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <Sparkles className="w-4 h-4" /> Scroll Ticker
        </button>
        <button
          onClick={() => setActiveTab('popup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'popup' ? 'bg-[#E6007E] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <Megaphone className="w-4 h-4" /> Discount Popup Modal
        </button>
      </div>

      {loading ? <div className="py-20 text-center"><Loader2 className="w-8 h-8 text-[#E6007E] animate-spin mx-auto" /></div> : (
        <>
          {activeTab === 'slides' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slides.map((s) => (
                <div key={s.id} className="bg-[#0A0A0A] border border-[#2B0A1F] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
                  <div className="relative h-44 w-full bg-[#2B0A1F]">
                    <Image src={s.imageUrl || '/hero/hero-1.png'} alt="" fill className="object-cover brightness-90" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#E6007E] text-white text-[10px] font-extrabold">Order #{s.sortOrder}</span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-white text-base">{s.heading}</h3>
                    <p className="text-xs text-gray-400">{s.subheading}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#2B0A1F]">
                      <span className="text-xs text-[#FF4FA0] font-semibold">{s.ctaText} → {s.ctaLink}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenEdit(s)} className="p-2 text-gray-300 hover:text-[#FF4FA0]"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-300 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'ticker' && promos && <AdminTickerForm initialData={promos} onSave={handleSavePromos} />}
          {activeTab === 'popup' && promos && <AdminPopupForm initialData={promos} onSave={handleSavePromos} />}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0A0A0A] border-2 border-[#2B0A1F] rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">{editingSlide ? 'Edit Hero Banner' : 'Add Hero Banner'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div><label className="block text-gray-300 font-bold mb-1">Heading</label><input required type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" /></div>
              <div><label className="block text-gray-300 font-bold mb-1">Subheading</label><input required type="text" value={subheading} onChange={(e) => setSubheading(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" /></div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">Banner Image Photo</label>
                {imageUrl ? (
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-[#E6007E]">
                    <Image src={imageUrl} alt="" fill className="object-cover" />
                    <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#2B0A1F] rounded-2xl p-6 text-center cursor-pointer">
                    <Upload className="w-8 h-8 text-[#FF4FA0] mx-auto mb-2" /><p className="text-xs font-bold text-white">Upload Banner Image</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files; if (f?.[0]) setImageUrl(URL.createObjectURL(f[0])); }} className="hidden" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-gray-300 font-bold mb-1">CTA Text</label><input required type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" /></div>
                <div><label className="block text-gray-300 font-bold mb-1">CTA Link</label><input required type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2B0A1F]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-[#2B0A1F] text-gray-300">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#E6007E] text-white font-bold">Save Slide</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
