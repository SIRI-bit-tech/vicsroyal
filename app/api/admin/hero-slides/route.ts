import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { heroSlides } from '@/db/schema';
import { getAdminSession } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const list = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { imageUrl, heading, subheading, ctaText, ctaLink, sortOrder, isActive } = await req.json();

    const [inserted] = await db
      .insert(heroSlides)
      .values({
        imageUrl,
        heading,
        subheading,
        ctaText: ctaText || 'Shop Now',
        ctaLink: ctaLink || '/category/wigs',
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        isActive: Boolean(isActive),
      })
      .returning();

    return NextResponse.json(inserted);
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json({ error: 'Failed to create hero slide' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, imageUrl, heading, subheading, ctaText, ctaLink, sortOrder, isActive } = await req.json();

    const [updated] = await db
      .update(heroSlides)
      .set({
        imageUrl,
        heading,
        subheading,
        ctaText,
        ctaLink,
        sortOrder: Number(sortOrder),
        isActive: Boolean(isActive),
      })
      .where(eq(heroSlides.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await db.delete(heroSlides).where(eq(heroSlides.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
  }
}
