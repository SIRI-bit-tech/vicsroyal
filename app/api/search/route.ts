import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { ilike, or, eq, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const searchTerm = `%${q.toLowerCase()}%`;

    const results = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        images: products.images,
        stockStatus: products.stockStatus,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        or(
          ilike(products.name, searchTerm),
          ilike(categories.name, searchTerm),
          sql`LOWER(${products.searchTags}::text) LIKE ${searchTerm}`
        )
      )
      .limit(8);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in search endpoint:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
