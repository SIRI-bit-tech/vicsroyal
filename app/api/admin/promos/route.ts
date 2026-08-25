import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { marketingPromos } from '@/db/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const list = await db.select().from(marketingPromos).where(eq(marketingPromos.id, 'global_promo_settings'));
    if (list.length === 0) {
      const [created] = await db.insert(marketingPromos).values({ id: 'global_promo_settings' }).returning();
      return NextResponse.json(created);
    }
    return NextResponse.json(list[0]);
  } catch (error) {
    console.error('Error fetching admin promos:', error);
    return NextResponse.json({ error: 'Failed to fetch promos' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const tickerExpires = body.tickerExpiresAt ? new Date(body.tickerExpiresAt) : null;
    const popupExpires = body.popupExpiresAt ? new Date(body.popupExpiresAt) : null;

    const [updated] = await db
      .insert(marketingPromos)
      .values({
        id: 'global_promo_settings',
        tickerEnabled: Boolean(body.tickerEnabled),
        tickerText: body.tickerText || '',
        tickerDiscountCode: body.tickerDiscountCode || null,
        tickerExpiresAt: tickerExpires,
        tickerCtaLink: body.tickerCtaLink || '/category/wigs',
        tickerCtaText: body.tickerCtaText || 'Shop Now',
        popupEnabled: Boolean(body.popupEnabled),
        popupHeading: body.popupHeading || '',
        popupSubheading: body.popupSubheading || '',
        popupDiscountTag: body.popupDiscountTag || '',
        popupImageUrl: body.popupImageUrl || '/hero/hero-1.png',
        popupCtaText: body.popupCtaText || 'Claim Deal',
        popupCtaLink: body.popupCtaLink || '/category/wigs',
        popupExpiresAt: popupExpires,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: marketingPromos.id,
        set: {
          tickerEnabled: Boolean(body.tickerEnabled),
          tickerText: body.tickerText || '',
          tickerDiscountCode: body.tickerDiscountCode || null,
          tickerExpiresAt: tickerExpires,
          tickerCtaLink: body.tickerCtaLink || '/category/wigs',
          tickerCtaText: body.tickerCtaText || 'Shop Now',
          popupEnabled: Boolean(body.popupEnabled),
          popupHeading: body.popupHeading || '',
          popupSubheading: body.popupSubheading || '',
          popupDiscountTag: body.popupDiscountTag || '',
          popupImageUrl: body.popupImageUrl || '/hero/hero-1.png',
          popupCtaText: body.popupCtaText || 'Claim Deal',
          popupCtaLink: body.popupCtaLink || '/category/wigs',
          popupExpiresAt: popupExpires,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error saving marketing promos:', error);
    return NextResponse.json({ error: 'Failed to save promo settings' }, { status: 500 });
  }
}
