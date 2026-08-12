'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Star } from 'lucide-react';
import { Testimonial } from '../../../types/testimonial';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [clientName, setClientName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('5');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (Array.isArray(data)) setTestimonials(data);
    } catch {}
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setClientName('');
    setContent('');
    setRating('5');
    setImageUrl('/seed/testimonials/client-1.jpg');
    setIsPublished(true);
    setShowModal(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingItem(t);
    setClientName(t.clientName);
    setContent(t.content);
    setRating(String(t.rating || 5));
    setImageUrl(t.imageUrl || '');
    setIsPublished(t.isPublished);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete testimonial?')) return;
    await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
    fetchTestimonials();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingItem?.id,
      clientName,
      content,
      rating: Number(rating),
      imageUrl: imageUrl || null,
      isPublished,
    };

    const method = editingItem ? 'PUT' : 'POST';
    await fetch('/api/admin/testimonials', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setShowModal(false);
    fetchTestimonials();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Client Testimonials</h1>
          <p className="text-xs text-gray-400 mt-1">Manage customer reviews displayed on the storefront.</p>
        </div>
        <button onClick={handleOpenCreate} className="px-5 py-3 rounded-xl bg-[#E6007E] text-white font-extrabold text-xs flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">{t.clientName}</h3>
              <div className="flex gap-1">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#E6007E] text-[#E6007E]" />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-300 italic">&quot;{t.content}&quot;</p>
            <div className="flex items-center justify-between pt-3 border-t border-[#2B0A1F] text-xs">
              <span className={t.isPublished ? 'text-green-400 font-bold' : 'text-gray-500'}>
                {t.isPublished ? 'Published' : 'Hidden'}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(t)} className="p-1 hover:text-[#FF4FA0]"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-lg bg-[#0A0A0A] border-2 border-[#2B0A1F] rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Client Name</label>
                <input required type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">Review Content</label>
                <textarea required rows={3} value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Rating (1-5)</label>
                  <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Photo / Avatar URL</label>
                  <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
                </div>
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} /> Published on Site
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2B0A1F]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-[#2B0A1F] text-gray-300">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#E6007E] text-white font-bold">Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
