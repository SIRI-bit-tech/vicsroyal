import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, products } from '@/db/schema';
import { getAdminSession } from '@/lib/auth';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).catch((err) => {
      console.error('Failed to query orders table:', err);
      return [];
    });

    const allProducts = await db.select({ id: products.id }).from(products).catch((err) => {
      console.error('Failed to query products table:', err);
      return [];
    });

    let totalSales = 0;
    let pendingCount = 0;
    let contactedCount = 0;
    let fulfilledCount = 0;
    let abandonedCount = 0;

    allOrders.forEach((o) => {
      const amt = parseFloat(String(o.totalAmount || 0));
      if (o.status === 'fulfilled') totalSales += isNaN(amt) ? 0 : amt;
      if (o.status === 'pending') pendingCount++;
      if (o.status === 'contacted') contactedCount++;
      if (o.status === 'fulfilled') fulfilledCount++;
      if (o.status === 'abandoned') abandonedCount++;
    });

    return NextResponse.json({
      totalSales,
      totalOrders: allOrders.length,
      pendingOrders: pendingCount,
      totalProducts: allProducts.length,
      statusBreakdown: {
        pending: pendingCount,
        contacted: contactedCount,
        fulfilled: fulfilledCount,
        abandoned: abandonedCount,
      },
      recentOrders: allOrders.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to load stats',
    }, { status: 500 });
  }
}
