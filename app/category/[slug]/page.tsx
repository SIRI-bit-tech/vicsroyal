import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { CategoryGrid } from '@/components/category/category-grid';
import { Product } from '@/types/product';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  try {
    const catList = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (catList.length === 0) return { title: 'Category Not Found' };
    return {
      title: `${catList[0].name} | VIC ROYAL BEAUTY`,
      description: `Shop our collection of luxury ${catList[0].name}. 100% Virgin Hair & HD Lace.`,
    };
  } catch {
    return { title: 'Category | VIC ROYAL BEAUTY' };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  try {
    const catList = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (catList.length === 0) notFound();

    const category = catList[0];

    const rawProducts = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, category.id))
      .orderBy(desc(products.createdAt));

    const productList: Product[] = rawProducts.map((p) => ({
      ...p,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return <CategoryGrid categoryName={category.name} initialProducts={productList} />;
  } catch {
    notFound();
  }
}
