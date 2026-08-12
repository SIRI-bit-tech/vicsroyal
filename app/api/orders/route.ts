import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phoneNumber, deliveryAddress, notes, items, totalAmount, turnstileToken } = body;

    if (!customerName || !phoneNumber || !deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    // Canonical Cloudflare Turnstile Verification
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || undefined;
    const verification = await verifyTurnstileToken(turnstileToken, 'checkout', clientIp);

    if (!verification.success && process.env.NODE_ENV === 'production' && process.env.TURNSTILE_SECRET) {
      console.warn('Turnstile verification rejected order submission:', verification.errorCodes);
      return NextResponse.json({ error: 'Security verification failed. Please complete Turnstile check.' }, { status: 403 });
    }

    const [newOrder] = await db
      .insert(orders)
      .values({
        customerName,
        phoneNumber,
        deliveryAddress,
        notes: notes || null,
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
