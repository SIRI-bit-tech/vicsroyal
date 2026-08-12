'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, Loader2, Upload, X } from 'lucide-react';
import { HeroSlide } from '@/types/hero';

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
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

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hero-slides');
      const data = await res.json();
      if (Array.isArray(data)) setSlides(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchSlides(); }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const url = URL.createObjectURL(files[0]);
    setImageUrl(url);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hero slide?')) return;
    await fetch(`/api/admin/hero-slides?id=${id}`, { method: 'DELETE' });
    fetchSlides();
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
    setShowModal(false); fetchSlides();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Hero Banners</h1>
          <p className="text-xs text-gray-400 mt-1">Manage main homepage auto-scrolling hero banners.</p>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-xs shadow-xl">
          <Plus className="w-4 h-4" /> Add Hero Slide
        </button>
      </div>

      {loading ? <div className="py-20 text-center"><Loader2 className="w-8 h-8 text-[#E6007E] animate-spin mx-auto" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((s) => (
            <div key={s.id} className="bg-[#0A0A0A] border border-[#2B0A1F] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
              <div className="relative h-44 w-full bg-[#2B0A1F]">
                <Image src={s.imageUrl || '/hero/hero-1.png'} alt="" fill className="object-cover brightness-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0A0A0A] border-2 border-[#2B0A1F] rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">{editingSlide ? 'Edit Hero Banner' : 'Add Hero Banner'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div><label className="block text-gray-300 font-bold mb-1">Main Heading</label><input required type="text" value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. LUXURY BONE STRAIGHT WIGS" className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" /></div>
              <div><label className="block text-gray-300 font-bold mb-1">Subheading</label><input required type="text" value={subheading} onChange={(e) => setSubheading(e.target.value)} placeholder="e.g. 100% Virgin Human Hair • Invisible HD Lace" className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" /></div>

              {/* Direct Image Upload Dropzone for Hero Banner */}
              <div>
                <label className="block text-gray-300 font-bold mb-1">Banner Image Photo</label>
                {imageUrl ? (
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-[#E6007E] bg-[#2B0A1F]">
                    <Image src={imageUrl} alt="Banner Preview" fill className="object-cover" />
                    <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#2B0A1F] hover:border-[#E6007E] rounded-2xl p-6 text-center bg-[#2B0A1F]/20 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 text-[#FF4FA0] mx-auto mb-2" />
                    <p className="text-xs font-bold text-white">Click or drag banner image to upload</p>
                    <p className="text-[10px] text-gray-400 mt-1">High resolution hero banner (PNG, JPG, WebP)</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-gray-300 font-bold mb-1">CTA Button Text</label><input required type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" /></div>
                <div><label className="block text-gray-300 font-bold mb-1">CTA Link Path</label><input required type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2B0A1F]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-[#2B0A1F] text-gray-300">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#E6007E] text-white font-bold">Save Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
