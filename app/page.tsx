import React from 'react';
import type { Metadata } from 'next';
import { db } from '@/db';
import { products, heroSlides, testimonials } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { AsymmetricGridSection } from '@/components/home/asymmetric-grid-section';
import { BestSellersSection } from '@/components/home/best-sellers-section';
import { ScrollStorySection } from '@/components/home/scroll-story-section';
import { FeaturedSection } from '@/components/home/featured-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { Product } from '@/types/product';
import { HeroSlide } from '@/types/hero';
import { Testimonial } from '@/types/testimonial';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vicsroyalbeauty.com';

export const metadata: Metadata = {
  title: 'VIC ROYAL BEAUTY | Luxury Virgin Hair, Wigs & HD Lace Closures',
  description: 'Shop 100% Virgin Human Hair wigs, raw Cambodian bundles, HD lace closures, frontals, and luxury hair accessories. Direct WhatsApp sales concierge & worldwide express delivery.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'VIC ROYAL BEAUTY | Luxury Virgin Hair & HD Lace Wigs',
    description: '100% Virgin & Raw Human Hair, Bone Straight Wigs, and HD Closures with worldwide express shipping.',
    url: siteUrl,
    images: [{ url: `${siteUrl}/hero/hero-1.png`, width: 1200, height: 630, alt: 'VIC ROYAL BEAUTY Hair Storefront' }],
  },
  twitter: {
    title: 'VIC ROYAL BEAUTY | Luxury Virgin Hair & Wigs',
    description: '100% Virgin Human Hair wigs, bundles, closures & frontals with instant WhatsApp ordering.',
    images: [`${siteUrl}/hero/hero-1.png`],
  },
};

export const revalidate = 60; // 1 min ISR

export default async function HomePage() {
  let slidesList: HeroSlide[] = [];
  let allProductsList: Product[] = [];
  let bestSellersList: Product[] = [];
  let featuredList: Product[] = [];
  let testimonialsList: Testimonial[] = [];

  try {
    const rawSlides = await db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.isActive, true))
      .orderBy(asc(heroSlides.sortOrder));

    slidesList = rawSlides.map((s) => ({
      ...s,
      sortOrder: s.sortOrder,
    }));

    const rawAllProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));

    allProductsList = rawAllProducts.map((p) => ({
      ...p,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    bestSellersList = allProductsList.filter((p) => p.isBestSeller);
    featuredList = allProductsList.filter((p) => p.isFeatured);

    const rawTestimonials = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(desc(testimonials.createdAt));

    testimonialsList = rawTestimonials.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error('Home page database query warning:', err);
  }

  return (
    <div className="space-y-4">
      <HeroCarousel slides={slidesList} />
      <AsymmetricGridSection products={allProductsList} />
      <BestSellersSection products={bestSellersList} />
      <ScrollStorySection products={allProductsList} />
      <FeaturedSection products={featuredList} />
      <TestimonialsSection testimonials={testimonialsList} />
    </div>
  );
}
