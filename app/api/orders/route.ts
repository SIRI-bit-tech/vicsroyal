import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phoneNumber, deliveryAddress, notes, promoCode, items, totalAmount } = body;

    if (!customerName || !phoneNumber || !deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    const [newOrder] = await db
      .insert(orders)
      .values({
        customerName,
        phoneNumber,
        deliveryAddress,
        notes: notes || null,
        promoCode: promoCode ? String(promoCode).trim().toUpperCase() : null,
        items,
        totalAmount: String(totalAmount),
        status: 'pending',
      })
      .returning();

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order lead:', error);
    return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
  }
}
