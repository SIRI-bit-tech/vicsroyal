'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, Loader2, Tag } from 'lucide-react';
import { Product } from '@/types/product';
import { formatNaira } from '@/lib/format-currency';
import { ImageUpload } from '@/components/admin/image-upload';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [searchTags, setSearchTags] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    fetch('/api/admin/categories').then((r) => r.json()).then((cats) => Array.isArray(cats) && setCategories(cats));
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName(''); setSlug(''); setDescription(''); setPrice(''); setCompareAtPrice(''); setImages([]);
    setCategoryId(categories[0]?.id || ''); setStockStatus('in_stock');
    setIsBestSeller(false); setIsFeatured(false); setIsNewArrival(true); setSearchTags('');
    setShowModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name); setSlug(p.slug); setDescription(p.description); setPrice(String(p.price));
    setCompareAtPrice(p.compareAtPrice ? String(p.compareAtPrice) : ''); setImages(p.images || []);
    setCategoryId(p.categoryId); setStockStatus(p.stockStatus);
    setIsBestSeller(p.isBestSeller); setIsFeatured(p.isFeatured); setIsNewArrival(Boolean(p.isNewArrival));
    setSearchTags(p.searchTags ? p.searchTags.join(', ') : '');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingProduct?.id, name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description, price: Number(price), compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      images: images.length > 0 ? images : ['/seed/products/hair-product-1-1.jpg'], categoryId, stockStatus,
      isBestSeller, isFeatured, isNewArrival,
      searchTags: searchTags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    await fetch('/api/admin/products', { method: editingProduct ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setShowModal(false); fetchProducts();
  };

  const numPrice = Number(price);
  const numCompare = Number(compareAtPrice);
  const isSaleActive = numCompare > 0 && numCompare > numPrice;
  const calcPercent = isSaleActive ? Math.round(((numCompare - numPrice) / numCompare) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Product Catalog</h1>
          <p className="text-xs text-gray-400 mt-1">Manage wigs, bundles, sale pricing, and new arrivals.</p>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-xs shadow-xl">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? <div className="py-20 text-center"><Loader2 className="w-8 h-8 text-[#E6007E] animate-spin mx-auto" /></div> : (
        <div className="bg-[#0A0A0A] border border-[#2B0A1F] rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#2B0A1F]/50 text-gray-300 uppercase">
              <tr><th className="p-4">Item</th><th className="p-4">Selling Price</th><th className="p-4">Badges & Sale</th><th className="p-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-[#2B0A1F] text-gray-300">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#2B0A1F]/20">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-[#2B0A1F]">
                      <Image src={p.images[0] || '/seed/products/hair-product-1-1.jpg'} alt="" fill className="object-cover" />
                    </div>
                    <div><h4 className="font-bold text-white text-sm">{p.name}</h4><p className="text-[10px] text-gray-500">{p.images.length} photos</p></div>
                  </td>
                  <td className="p-4">
                    <div className="font-extrabold text-[#FF4FA0] text-sm">{formatNaira(p.price)}</div>
                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                      <div className="text-[11px] text-gray-500 line-through">{formatNaira(p.compareAtPrice)}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold">
                          {Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)}% OFF
                        </span>
                      )}
                      {p.isNewArrival && <span className="px-2 py-0.5 rounded bg-[#FF4FA0] text-white text-[10px] font-bold">New Arrival</span>}
                      {p.isBestSeller && <span className="px-2 py-0.5 rounded bg-[#E6007E] text-white text-[10px] font-bold">Best Seller</span>}
                      {p.isFeatured && <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold">Featured</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenEdit(p)} className="p-2 hover:text-[#FF4FA0]"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0A0A0A] border-2 border-[#2B0A1F] rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div><label className="block text-gray-300 font-bold mb-1">Product Name</label><input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Selling / Sale Price (₦) *</label>
                  <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 185000" className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Original Price (₦) (Optional)</label>
                  <input type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} placeholder="e.g. 220000 (for sale strikethrough)" className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" />
                </div>
              </div>
              {isSaleActive && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Storefront Sale Live: <strong>{calcPercent}% OFF</strong> (Customers save {formatNaira(numCompare - numPrice)})</span>
                </div>
              )}
              <div><label className="block text-gray-300 font-bold mb-1">Description</label><textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white" /></div>
              <ImageUpload images={images} onChange={setImages} />
              <div><label className="block text-gray-300 font-bold mb-1">Category</label><select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white">{categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white font-bold"><input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="accent-[#FF4FA0]" /> New Arrival ✨</label>
                <label className="flex items-center gap-2 cursor-pointer text-white font-bold"><input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="accent-[#E6007E]" /> Best Seller 🔥</label>
                <label className="flex items-center gap-2 cursor-pointer text-white font-bold"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-purple-500" /> Featured ⭐</label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2B0A1F]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-[#2B0A1F] text-gray-300">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#E6007E] text-white font-bold">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
