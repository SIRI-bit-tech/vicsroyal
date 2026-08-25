import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { CategoryGrid } from '@/components/category/category-grid';
import { Product } from '@/types/product';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vicsroyalbeauty.com';

function getCategoryDescription(slug: string, name: string): string {
  const s = slug.toLowerCase();
  if (s.includes('wig')) {
    return 'Explore our luxury collection of 100% Raw Virgin Human Hair wigs, HD frontal lace wigs, and bone straight closure wigs with worldwide express shipping.';
  }
  if (s.includes('bundle')) {
    return 'Shop 100% Raw Virgin human hair bundles, Cambodian straight bundles, and body wave extensions with full cuticles aligned and zero shedding.';
  }
  if (s.includes('closure')) {
    return 'Discover ultra-thin HD lace closures and transparent swiss lace pieces for seamless, undetectable hairline melt and effortless styling.';
  }
  if (s.includes('frontal')) {
    return 'Premium 13x4 and 13x6 HD Swiss lace frontals for custom luxury styling, pre-plucked hairlines, and realistic scalps.';
  }
  return `Browse our hand-selected luxury ${name} collection. 100% Virgin Human Hair with direct WhatsApp sales concierge and fast express delivery.`;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const catList = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (catList.length === 0) {
      return {
        title: 'Category Not Found | VIC ROYAL BEAUTY',
        robots: { index: false, follow: false },
      };
    }

    const cat = catList[0];
    const title = `${cat.name} Collection — Luxury 100% Virgin Hair | VIC ROYAL BEAUTY`;
    const description = getCategoryDescription(slug, cat.name);
    const categoryUrl = `${siteUrl}/category/${slug}`;

    const catProducts = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, cat.id))
      .limit(1);

    const ogImage = catProducts[0]?.images?.[0]
      ? (catProducts[0].images[0].startsWith('http') ? catProducts[0].images[0] : `${siteUrl}${catProducts[0].images[0]}`)
      : `${siteUrl}/hero/hero-1.png`;

    return {
      title,
      description,
      alternates: {
        canonical: categoryUrl,
      },
      openGraph: {
        title,
        description,
        url: categoryUrl,
        type: 'website',
        images: [{ url: ogImage, width: 800, height: 800, alt: `${cat.name} Collection` }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: 'Luxury Hair Category | VIC ROYAL BEAUTY',
      alternates: { canonical: `${siteUrl}/category/${slug}` },
    };
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
