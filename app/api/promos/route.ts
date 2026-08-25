import { NextResponse } from 'next/server';
import { db } from '@/db';
import { marketingPromos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await db
      .select()
      .from(marketingPromos)
      .where(eq(marketingPromos.id, 'global_promo_settings'))
      .catch((err) => {
        console.error('Error querying marketing promos:', err);
        return [];
      });

    if (list.length === 0) {
      return NextResponse.json({
        tickerEnabled: true,
        tickerText: '⚡ FLASH PROMO: Get 15% OFF all Luxury Bone Straight Wigs & Bundles! Limited Time Only',
        tickerDiscountCode: 'ROYAL15',
        tickerExpiresAt: null,
        tickerCtaLink: '/category/wigs',
        tickerCtaText: 'Shop Now',
        popupEnabled: false,
        popupHeading: 'EXCLUSIVE FLASH SALE ✨',
        popupSubheading: 'Enjoy exclusive savings on 100% Raw Virgin Human Hair.',
        popupDiscountTag: 'UP TO 20% OFF',
        popupImageUrl: '/hero/hero-1.png',
        popupCtaText: 'Claim Discount Now',
        popupCtaLink: '/category/wigs',
        popupExpiresAt: null,
      });
    }

    return NextResponse.json(list[0]);
  } catch (error) {
    console.error('Public promos API error:', error);
    return NextResponse.json({ error: 'Failed to fetch promos' }, { status: 500 });
  }
}
