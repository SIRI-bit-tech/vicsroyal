'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { formatNaira } from '@/lib/format-currency';

interface ChartProps {
  statusBreakdown: {
    pending: number;
    contacted: number;
    fulfilled: number;
    abandoned: number;
  };
  totalSales: number;
}

export function DashboardChart({ statusBreakdown, totalSales }: ChartProps) {
  const chartData = [
    { name: 'Pending', orders: statusBreakdown.pending, color: '#F59E0B' },
    { name: 'Contacted', orders: statusBreakdown.contacted, color: '#3B82F6' },
    { name: 'Fulfilled', orders: statusBreakdown.fulfilled, color: '#10B981' },
    { name: 'Abandoned', orders: statusBreakdown.abandoned, color: '#EF4444' },
  ];

  const pieData = chartData.filter((d) => d.orders > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recharts Bar Chart Panel */}
      <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Live Order Volume Chart</h3>
            <p className="text-xs text-gray-400">Order count distribution by status</p>
          </div>
          <span className="text-xs font-bold text-[#FF4FA0] px-3 py-1 bg-[#2B0A1F] rounded-full">
            Recharts Live
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#2B0A1F', borderRadius: '12px', color: '#fff' }}
                cursor={{ fill: '#2B0A1F', opacity: 0.4 }}
              />
              <Bar dataKey="orders" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recharts Donut Chart Panel */}
      <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] flex flex-col justify-between shadow-xl">
        <div>
          <h3 className="text-base font-extrabold text-white">Pipeline Share</h3>
          <p className="text-xs text-gray-400">Order conversion status ratio</p>
        </div>

        <div className="h-48 w-full flex items-center justify-center my-2">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="orders"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#2B0A1F', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-gray-500 italic">No orders captured yet</div>
          )}
        </div>

        <div className="pt-3 border-t border-[#2B0A1F] text-center">
          <span className="text-xs text-gray-400">Total Sales Value: </span>
          <span className="text-sm font-black text-[#FF4FA0]">{formatNaira(totalSales)}</span>
        </div>
      </div>
    </div>
  );
}
