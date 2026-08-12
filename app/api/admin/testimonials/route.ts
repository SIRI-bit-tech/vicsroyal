import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { getAdminSession } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const list = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { clientName, content, rating, imageUrl, isPublished } = await req.json();

    const [inserted] = await db
      .insert(testimonials)
      .values({
        clientName,
        content,
        rating: rating ? Number(rating) : 5,
        imageUrl: imageUrl || null,
        isPublished: Boolean(isPublished),
      })
      .returning();

    return NextResponse.json(inserted);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, clientName, content, rating, imageUrl, isPublished } = await req.json();

    const [updated] = await db
      .update(testimonials)
      .set({
        clientName,
        content,
        rating: rating ? Number(rating) : null,
        imageUrl,
        isPublished: Boolean(isPublished),
      })
      .where(eq(testimonials.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await db.delete(testimonials).where(eq(testimonials.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
