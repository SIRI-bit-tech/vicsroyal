'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingCart, Clock, ShoppingBag, ArrowUpRight, Loader2 } from 'lucide-react';
import { formatNaira } from '@/lib/format-currency';
import { DashboardChart } from '@/components/admin/dashboard-chart';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  statusBreakdown: { pending: number; contacted: number; fulfilled: number; abandoned: number };
  recentOrders: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        <Loader2 className="w-8 h-8 text-[#E6007E] animate-spin mx-auto mb-2" />
        <p className="text-xs font-semibold">Loading Live Dashboard Analytics...</p>
      </div>
    );
  }

  const s = stats || {
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    statusBreakdown: { pending: 0, contacted: 0, fulfilled: 0, abandoned: 0 },
    recentOrders: [],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Live Admin Dashboard</h1>
        <p className="text-xs text-gray-400 mt-1">Real-time overview of sales, WhatsApp order leads, and product inventory.</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Total Fulfilled Sales</span>
            <div className="p-2.5 rounded-xl bg-[#2B0A1F] text-[#FF4FA0]"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-black text-[#FF4FA0]">{formatNaira(s.totalSales)}</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Total Orders Captured</span>
            <div className="p-2.5 rounded-xl bg-[#2B0A1F] text-white"><ShoppingCart className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-black text-white">{s.totalOrders}</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Pending WhatsApp Leads</span>
            <div className="p-2.5 rounded-xl bg-[#2B0A1F] text-amber-400"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-black text-amber-400">{s.pendingOrders}</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Active Products</span>
            <div className="p-2.5 rounded-xl bg-[#2B0A1F] text-[#E6007E]"><ShoppingBag className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-black text-[#E6007E]">{s.totalProducts}</div>
        </div>
      </div>

      {/* Live Recharts Analytics Panel */}
      <DashboardChart statusBreakdown={s.statusBreakdown} totalSales={s.totalSales} />

      {/* Recent Orders List */}
      <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white">Recent WhatsApp Orders</h3>
          <Link href="/admin/orders" className="text-xs font-bold text-[#FF4FA0] hover:underline flex items-center gap-1">
            View All Orders <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#2B0A1F]/50 text-gray-300 uppercase">
              <tr><th className="p-3">Customer</th><th className="p-3">Phone</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-[#2B0A1F] text-gray-300">
              {s.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="p-3 font-bold text-white">{o.customerName}</td>
                  <td className="p-3 text-gray-400">{o.phoneNumber}</td>
                  <td className="p-3 font-bold text-[#FF4FA0]">{formatNaira(o.totalAmount)}</td>
                  <td className="p-3 capitalize"><span className="px-2.5 py-1 rounded-full bg-[#2B0A1F] text-xs font-semibold">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
