import { MetadataRoute } from 'next';
import { db } from '@/db';
import { products, categories } from '@/db/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vicsroyalbeauty.com';

  // 1. Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  try {
    // 2. Fetch categories from DB
    const catList = await db.select({ slug: categories.slug }).from(categories);
    catList.forEach((c) => {
      routes.push({
        url: `${baseUrl}/category/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });

    // 3. Fetch products from DB
    const prodList = await db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products);
    prodList.forEach((p) => {
      routes.push({
        url: `${baseUrl}/product/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return routes;
}
