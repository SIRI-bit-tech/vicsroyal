'use client';

import React from 'react';
import { DonutChart, BarChart, ResponsiveChart } from '@derpdaderp/chartkit';
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
  const sb = statusBreakdown || { pending: 0, contacted: 0, fulfilled: 0, abandoned: 0 };
  const totalCount = sb.pending + sb.contacted + sb.fulfilled + sb.abandoned;

  // Real-time chart data for DonutChart
  const donutData = totalCount > 0 ? [
    { label: 'Pending', value: sb.pending },
    { label: 'Contacted', value: sb.contacted },
    { label: 'Fulfilled', value: sb.fulfilled },
    { label: 'Abandoned', value: sb.abandoned },
  ] : [
    { label: 'Pending', value: 0 },
    { label: 'Contacted', value: 0 },
    { label: 'Fulfilled', value: 0 },
    { label: 'Abandoned', value: 0 },
  ];

  // Bar chart data
  const barData = [
    { status: 'Pending', orders: sb.pending },
    { status: 'Contacted', orders: sb.contacted },
    { status: 'Fulfilled', orders: sb.fulfilled },
    { status: 'Abandoned', orders: sb.abandoned },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Realtime Bar Chart */}
      <div className="lg:col-span-2 p-4 sm:p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] space-y-4 shadow-xl flex flex-col">
        <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">Live Order Volume Chart</h3>
            <p className="text-xs text-gray-400">Order count distribution by status</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-[#FF4FA0] px-3 py-1 bg-[#2B0A1F] rounded-full">
              ChartKit Realtime
            </span>
          </div>
        </div>

        <div className="w-full pt-2 min-h-[180px] sm:min-h-[220px]">
          <ResponsiveChart height={220}>
            {({ width }) => (
              <BarChart
                data={barData}
                dataKey="orders"
                categoryKey="status"
                theme="midnight"
                width={width}
                height={220}
                showLabels={true}
                format={(v) => `${v} orders`}
                barRadius={6}
              />
            )}
          </ResponsiveChart>
        </div>
      </div>

      {/* Realtime Donut Chart */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#0A0A0A] border border-[#2B0A1F] flex flex-col justify-between shadow-xl">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-white">Pipeline Share</h3>
          <p className="text-xs text-gray-400">Order conversion status ratio</p>
        </div>

        <div className="w-full flex items-center justify-center my-4 overflow-hidden">
          {totalCount > 0 ? (
            <DonutChart
              data={donutData}
              dataKey="value"
              labelKey="label"
              theme="midnight"
              size={220}
              innerRadius={0.6}
              showLegend
              legendPosition="right"
              padAngle={2}
            />
          ) : (
            <div className="py-10 text-center space-y-2">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#2B0A1F] flex items-center justify-center mx-auto text-gray-600">
                0
              </div>
              <p className="text-xs text-gray-400 font-medium">No customer orders placed yet.</p>
              <p className="text-[10px] text-gray-500">Live chart will update when orders are received.</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#2B0A1F] text-center">
          <span className="text-xs text-gray-400">Total Fulfilled Revenue: </span>
          <span className="text-sm font-black text-[#FF4FA0]">{formatNaira(totalSales)}</span>
        </div>
      </div>
    </div>
  );
}
