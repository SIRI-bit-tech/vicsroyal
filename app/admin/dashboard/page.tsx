'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingCart, Clock, ShoppingBag, ArrowUpRight, Loader2, RefreshCw } from 'lucide-react';
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
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchStats = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/dashboard', { cache: 'no-store', credentials: 'include' });
      if (res.status === 401) { window.location.href = '/auth/admin/login'; return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && !data.error) {
        setStats({
          totalSales: data.totalSales || 0,
          totalOrders: data.totalOrders || 0,
          pendingOrders: data.pendingOrders || 0,
          totalProducts: data.totalProducts || 0,
          statusBreakdown: data.statusBreakdown || { pending: 0, contacted: 0, fulfilled: 0, abandoned: 0 },
          recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
        });
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn('Dashboard sync:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(), 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="py-24 text-center text-gray-400">
        <Loader2 className="w-8 h-8 text-[#E6007E] animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-white">Connecting to Realtime Dashboard...</p>
        <p className="text-xs text-gray-500 mt-1">Fetching live inventory, revenue, and WhatsApp orders</p>
      </div>
    );
  }

  const s = stats || {
    totalSales: 0, totalOrders: 0, pendingOrders: 0, totalProducts: 0,
    statusBreakdown: { pending: 0, contacted: 0, fulfilled: 0, abandoned: 0 }, recentOrders: [],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Live Admin Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">Real-time overview of sales, WhatsApp order leads, and product inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B0A1F] border border-[#FF4FA0]/30 text-xs font-semibold text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Realtime Live</span>
            {lastUpdated && <span className="text-gray-500 text-[11px]">({lastUpdated})</span>}
          </div>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-[#2B0A1F] hover:bg-[#E6007E] text-white transition-colors disabled:opacity-50"
            title="Refresh Realtime Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
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
            <span className="text-xs font-bold text-gray-400">Total Orders</span>
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
            <span className="text-xs font-bold text-gray-400">Active Inventory</span>
            <div className="p-2.5 rounded-xl bg-[#2B0A1F] text-[#E6007E]"><ShoppingBag className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-black text-[#E6007E]">{s.totalProducts}</div>
        </div>
      </div>

      <DashboardChart statusBreakdown={s.statusBreakdown} totalSales={s.totalSales} />

      {/* Recent Orders */}
      <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white">Recent WhatsApp Orders</h3>
          <Link href="/admin/orders" className="text-xs font-bold text-[#FF4FA0] hover:underline flex items-center gap-1">
            View All Orders <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {s.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2B0A1F]/50 text-gray-300 uppercase">
                <tr><th className="p-3">Customer</th><th className="p-3">Phone</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-[#2B0A1F] text-gray-300">
                {s.recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#2B0A1F]/20 transition-colors">
                    <td className="p-3 font-bold text-white">{o.customerName}</td>
                    <td className="p-3 text-gray-400">{o.phoneNumber}</td>
                    <td className="p-3 font-bold text-[#FF4FA0]">{formatNaira(o.totalAmount)}</td>
                    <td className="p-3 capitalize">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        o.status === 'fulfilled' ? 'bg-emerald-900/50 text-emerald-300' :
                        o.status === 'contacted' ? 'bg-blue-900/50 text-blue-300' :
                        o.status === 'abandoned' ? 'bg-red-900/50 text-red-300' :
                        'bg-amber-900/50 text-amber-300'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 text-xs">
            No orders received yet. Incoming WhatsApp checkouts will appear here in real time.
          </div>
        )}
      </div>
    </div>
  );
}
