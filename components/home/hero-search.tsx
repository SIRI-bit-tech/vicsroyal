'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { formatNaira } from '../../lib/format-currency';

interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  images: string[];
  stockStatus: string;
  categoryName?: string;
}

export function HeroSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setResults(data);
            setIsOpen(true);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto z-30">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search wigs, bundles, HD lace, bone straight..."
          className="w-full pl-12 pr-10 py-4 rounded-2xl bg-[#0A0A0A]/85 border-2 border-[#E6007E]/50 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4FA0] shadow-2xl backdrop-blur-md transition-all text-base sm:text-lg"
        />
        <Search className="absolute left-4 w-6 h-6 text-[#FF4FA0]" />
        {isLoading && <Loader2 className="absolute right-4 w-5 h-5 text-[#FF4FA0] animate-spin" />}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#0A0A0A] border-2 border-[#2B0A1F] rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="divide-y divide-[#2B0A1F]">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 hover:bg-[#2B0A1F]/60 transition-colors"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#2B0A1F] flex-shrink-0">
                    <Image
                      src={product.images[0] || '/seed/products/wig-1.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                    {product.categoryName && (
                      <span className="text-xs text-[#FF4FA0] font-medium">{product.categoryName}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#FF4FA0]">
                      {formatNaira(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              <Sparkles className="w-8 h-8 text-[#E6007E] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No hair products found matching &quot;{query}&quot;</p>
              <p className="text-xs text-gray-500 mt-1">Try searching for &quot;wig&quot;, &quot;bundle&quot;, or &quot;HD lace&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
