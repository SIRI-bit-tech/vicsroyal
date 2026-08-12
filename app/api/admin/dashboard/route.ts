import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, products } from '@/db/schema';
import { getAdminSession } from '@/lib/auth';
import { desc, count, sql } from 'drizzle-orm';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allProducts = await db.select({ id: products.id }).from(products);

    let totalSales = 0;
    let pendingCount = 0;
    let contactedCount = 0;
    let fulfilledCount = 0;
    let abandonedCount = 0;

    allOrders.forEach((o) => {
      const amt = parseFloat(String(o.totalAmount || 0));
      if (o.status === 'fulfilled') totalSales += amt;
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
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
