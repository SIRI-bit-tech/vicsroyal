import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ProductDetailView } from '@/components/product/product-detail-view';
import { Product } from '@/types/product';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  try {
    const list = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (list.length === 0) return { title: 'Product Not Found' };
    return {
      title: `${list[0].name} | VIC ROYAL BEAUTY`,
      description: list[0].description,
    };
  } catch {
    return { title: 'Product | VIC ROYAL BEAUTY' };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const list = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (list.length === 0) notFound();

    const p = list[0];
    const product: Product = {
      ...p,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };

    return <ProductDetailView product={product} />;
  } catch {
    notFound();
  }
}
