import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ProductDetailView } from '@/components/product/product-detail-view';
import { Product } from '@/types/product';
import { formatNaira } from '@/lib/format-currency';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vicsroyalbeauty.com';

function getKeyAttribute(name: string, description: string): string {
  const combined = `${name} ${description}`.toLowerCase();
  if (combined.includes('bone straight')) return 'Bone Straight Virgin Hair';
  if (combined.includes('hd lace')) return 'HD Lace 100% Human Hair';
  if (combined.includes('deep wave')) return 'Raw Deep Wave Bundles';
  if (combined.includes('body wave')) return 'Luxury Body Wave Virgin Hair';
  if (combined.includes('closure') || combined.includes('frontal')) return 'HD Swiss Lace Frontal';
  if (combined.includes('wig')) return '100% Raw Virgin Hair Wig';
  return '100% Virgin Human Hair';
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const list = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (list.length === 0) {
      return {
        title: 'Product Not Found | VIC ROYAL BEAUTY',
        robots: { index: false, follow: false },
      };
    }

    const p = list[0];
    const attribute = getKeyAttribute(p.name, p.description);
    const title = `${p.name} — ${attribute} | VIC ROYAL BEAUTY`;
    const priceFormatted = formatNaira(Number(p.price));
    const description = `${p.description.slice(0, 150)}... Buy ${p.name} for ${priceFormatted} with direct WhatsApp delivery.`;
    const productUrl = `${siteUrl}/product/${slug}`;
    const primaryImage = p.images && p.images.length > 0
      ? (p.images[0].startsWith('http') ? p.images[0] : `${siteUrl}${p.images[0]}`)
      : `${siteUrl}/hero/hero-1.png`;

    return {
      title,
      description,
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        title,
        description,
        url: productUrl,
        type: 'website',
        images: [{ url: primaryImage, width: 800, height: 800, alt: p.name }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [primaryImage],
      },
    };
  } catch {
    return {
      title: 'Luxury Hair Product | VIC ROYAL BEAUTY',
      alternates: { canonical: `${siteUrl}/product/${slug}` },
    };
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
