'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch {}
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    });

    setName('');
    setSlug('');
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-white">Categories Management</h1>
        <p className="text-xs text-gray-400 mt-1">Add or manage dynamic category navigation links.</p>
      </div>

      <form onSubmit={handleAddCategory} className="flex gap-4 p-4 rounded-2xl bg-[#0A0A0A] border border-[#2B0A1F]">
        <input
          type="text"
          required
          placeholder="Category Name (e.g. Frontals)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white text-xs"
        />
        <input
          type="text"
          placeholder="Slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-48 px-4 py-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white text-xs"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#E6007E] text-white font-bold text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="bg-[#0A0A0A] border border-[#2B0A1F] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#2B0A1F]/50 text-gray-300 uppercase">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B0A1F] text-gray-300">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="p-4 font-bold text-white">{c.name}</td>
                <td className="p-4 text-gray-400">{c.slug}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="p-2 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
