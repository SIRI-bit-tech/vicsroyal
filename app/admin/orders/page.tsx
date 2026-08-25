'use client';

import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../../../types/order';
import { formatNaira } from '../../../lib/format-currency';
import { Phone, MapPin, Calendar } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch {}
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: OrderStatus) => {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchOrders();
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Orders & Lead Captures</h1>
          <p className="text-xs text-gray-400 mt-1">Review WhatsApp hand-off orders and update sale statuses.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white text-xs font-bold focus:outline-none"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-500 bg-[#0A0A0A] border border-[#2B0A1F] rounded-2xl">
            No orders found matching status &quot;{filter}&quot;.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2B0A1F] gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {order.customerName}
                    <span className="text-xs text-gray-400 font-normal">({order.id.slice(0, 8)})</span>
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#E6007E]" /> {order.phoneNumber}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#E6007E]" /> {order.deliveryAddress}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#E6007E]" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                      order.status === 'fulfilled' ? 'bg-green-950/80 border-green-700 text-green-400' :
                      order.status === 'contacted' ? 'bg-blue-950/80 border-blue-700 text-blue-400' :
                      order.status === 'abandoned' ? 'bg-red-950/80 border-red-700 text-red-400' :
                      'bg-amber-950/80 border-amber-700 text-amber-400'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordered Items</h4>
                <div className="divide-y divide-[#2B0A1F]/50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between text-xs text-gray-300">
                      <span>{item.quantity}× {item.name}</span>
                      <span className="font-bold text-[#FF4FA0]">{formatNaira(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center pt-3 border-t border-[#2B0A1F] gap-2">
                <div className="flex items-center gap-3 text-xs">
                  {order.promoCode && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E6007E]/20 border border-[#E6007E]/50 text-[#FF4FA0] font-bold">
                      Promo: {order.promoCode}
                    </span>
                  )}
                  {order.notes && <span className="text-gray-400 italic">Note: {order.notes}</span>}
                </div>
                <div className="text-sm font-bold text-white">
                  Total: <span className="text-base text-[#FF4FA0] font-black">{formatNaira(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
