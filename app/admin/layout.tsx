import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAdminSession } from '@/lib/auth';
import { LayoutDashboard, ShoppingBag, Layers, Image as ImageIcon, MessageSquare, ShoppingCart, LogOut } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Console | VIC ROYAL BEAUTY',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  
  // Return 404 Not Found for any unauthenticated attempt to access /admin routes
  if (!session) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0A0A0A] border-r border-[#2B0A1F] p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E6007E]/50 flex-shrink-0">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-base font-black text-white leading-tight">
                VIC ROYAL <span className="text-[#E6007E]">ADMIN</span>
              </h2>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">{session.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2B0A1F] text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#FF4FA0]" /> Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2B0A1F] text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#E6007E]" /> Products
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2B0A1F] text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              <Layers className="w-4 h-4 text-[#E6007E]" /> Categories
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2B0A1F] text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-[#E6007E]" /> Orders
            </Link>
            <Link
              href="/admin/hero-slides"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2B0A1F] text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-[#E6007E]" /> Hero Banner
            </Link>
            <Link
              href="/admin/testimonials"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2B0A1F] text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#E6007E]" /> Testimonials
            </Link>
          </nav>
        </div>

        <form action="/api/auth/admin/logout" method="POST" className="pt-6 border-t border-[#2B0A1F]">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2B0A1F]/50 text-gray-400 hover:text-red-400 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
