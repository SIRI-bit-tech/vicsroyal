'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { HeroSlide } from '../../../types/hero';

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [imageUrl, setImageUrl] = useState('');
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [ctaText, setCtaText] = useState('Shop Now');
  const [ctaLink, setCtaLink] = useState('/category/wigs');
  const [sortOrder, setSortOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/hero-slides');
      const data = await res.json();
      if (Array.isArray(data)) setSlides(data);
    } catch {}
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setImageUrl('/seed/hero/hero-1.jpg');
    setHeading('');
    setSubheading('');
    setCtaText('Shop Now');
    setCtaLink('/category/wigs');
    setSortOrder(String(slides.length + 1));
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setImageUrl(slide.imageUrl);
    setHeading(slide.heading);
    setSubheading(slide.subheading);
    setCtaText(slide.ctaText);
    setCtaLink(slide.ctaLink);
    setSortOrder(String(slide.sortOrder));
    setIsActive(slide.isActive);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hero slide?')) return;
    await fetch(`/api/admin/hero-slides?id=${id}`, { method: 'DELETE' });
    fetchSlides();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingSlide?.id,
      imageUrl,
      heading,
      subheading,
      ctaText,
      ctaLink,
      sortOrder: Number(sortOrder),
      isActive,
    };

    const method = editingSlide ? 'PUT' : 'POST';
    await fetch('/api/admin/hero-slides', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setShowModal(false);
    fetchSlides();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Hero Carousel Banner</h1>
          <p className="text-xs text-gray-400 mt-1">Manage storefront main hero slides and banners.</p>
        </div>
        <button onClick={handleOpenCreate} className="px-5 py-3 rounded-xl bg-[#E6007E] text-white font-extrabold text-xs flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((s) => (
          <div key={s.id} className="relative rounded-2xl bg-[#0A0A0A] border border-[#2B0A1F] overflow-hidden shadow-xl">
            <div className="relative h-44 w-full bg-[#2B0A1F]">
              <Image src={s.imageUrl} alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-end">
                <h3 className="text-lg font-black text-white">{s.heading}</h3>
                <p className="text-xs text-gray-300">{s.subheading}</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-semibold">Order #{s.sortOrder} • {s.isActive ? 'Active' : 'Disabled'}</span>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(s)} className="p-1 hover:text-[#FF4FA0]"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-lg bg-[#0A0A0A] border-2 border-[#2B0A1F] rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">{editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Image URL</label>
                <input required type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">Heading</label>
                <input required type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">Subheading</label>
                <input required type="text" value={subheading} onChange={(e) => setSubheading(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">CTA Text</label>
                  <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">CTA Link</label>
                  <input type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
                </div>
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active Banner
                </label>
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
