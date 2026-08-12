import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { getAdminSession } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const list = await db.select().from(products).orderBy(desc(products.createdAt));
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, slug, description, price, compareAtPrice, images, categoryId, stockStatus, isBestSeller, isFeatured, isNewArrival, searchTags } = body;

    const [inserted] = await db
      .insert(products)
      .values({
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        description,
        price: String(price),
        compareAtPrice: compareAtPrice ? String(compareAtPrice) : null,
        images: images || [],
        categoryId,
        stockStatus: stockStatus || 'in_stock',
        isBestSeller: Boolean(isBestSeller),
        isFeatured: Boolean(isFeatured),
        isNewArrival: Boolean(isNewArrival),
        searchTags: searchTags || [],
      })
      .returning();

    return NextResponse.json(inserted);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, name, slug, description, price, compareAtPrice, images, categoryId, stockStatus, isBestSeller, isFeatured, isNewArrival, searchTags } = body;

    const [updated] = await db
      .update(products)
      .set({
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        description,
        price: String(price),
        compareAtPrice: compareAtPrice ? String(compareAtPrice) : null,
        images,
        categoryId,
        stockStatus,
        isBestSeller: Boolean(isBestSeller),
        isFeatured: Boolean(isFeatured),
        isNewArrival: Boolean(isNewArrival),
        searchTags: searchTags || [],
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
