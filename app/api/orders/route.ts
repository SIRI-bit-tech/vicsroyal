import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phoneNumber, deliveryAddress, notes, items, totalAmount } = body;

    if (!customerName || !phoneNumber || !deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    const [newOrder] = await db
      .insert(orders)
      .values({
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        notes: notes ? notes.trim() : null,
        items,
        totalAmount: String(totalAmount),
        status: 'pending',
      })
      .returning();

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
  }
}
