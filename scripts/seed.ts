import { db } from '../db';
import { categories, products, heroSlides, testimonials } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function seed() {
  console.log('--- SEEDING NEON POSTGRESQL DATABASE ---');

  // 1. Ensure Categories exist and map IDs
  const categoryData = [
    { name: 'Wigs', slug: 'wigs' },
    { name: 'Bundles', slug: 'bundles' },
    { name: 'Closures & Frontals', slug: 'closures' },
    { name: 'Extensions', slug: 'extensions' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoryData) {
    const existing = await db.select().from(categories).where(eq(categories.slug, cat.slug));
    if (existing.length > 0) {
      categoryMap[cat.slug] = existing[0].id;
    } else {
      const [inserted] = await db.insert(categories).values(cat).returning();
      categoryMap[cat.slug] = inserted.id;
    }
  }
  console.log('Categories Map:', categoryMap);

  // 2. Load products from naija-hair-products.json
  const naijaProductsFile = path.join(process.cwd(), 'scripts/naija-hair-products.json');
  let realHairProducts: any[] = [];
  if (fs.existsSync(naijaProductsFile)) {
    realHairProducts = JSON.parse(fs.readFileSync(naijaProductsFile, 'utf-8'));
  }
  console.log(`Loaded ${realHairProducts.length} product objects from JSON file.`);

  // 3. Clear existing products
  await db.delete(products);
  console.log('Cleared existing products table.');

  // 4. Insert each product individually to verify success
  let insertedCount = 0;
  for (let i = 0; i < realHairProducts.length; i++) {
    const p = realHairProducts[i];
    const catId = categoryMap[p.categorySlug] || categoryMap['wigs'];

    if (!catId) {
      console.error(`Missing categoryId for product ${p.name}`);
      continue;
    }

    try {
      await db.insert(products).values({
        name: p.name,
        slug: `${p.slug}-${i + 1}`, // Ensure unique slug
        description: p.description || 'Premium 100% Virgin Human Hair product.',
        price: String(p.price || 120000),
        compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : null,
        images: p.images || ['/seed/products/hair-product-1-1.jpg'],
        categoryId: catId,
        stockStatus: 'in_stock',
        isBestSeller: Boolean(i % 3 === 0),
        isFeatured: Boolean(i % 2 === 0),
        searchTags: p.searchTags || ['hair', 'wig', 'bundle'],
      });
      insertedCount++;
    } catch (insertErr) {
      console.error(`Failed to insert product "${p.name}":`, insertErr);
    }
  }

  console.log(`✓ SUCCESS: Inserted ${insertedCount} products into database!`);

  // 5. Seed Hero Slides & Testimonials
  await db.delete(heroSlides);
  await db.insert(heroSlides).values([
    {
      imageUrl: '/hero/hero-1.png',
      heading: 'LUXURY BONE STRAIGHT WIGS',
      subheading: '100% Virgin Human Hair • Invisible HD Lace',
      ctaText: 'Shop Wigs',
      ctaLink: '/category/wigs',
      sortOrder: 1,
      isActive: true,
    },
    {
      imageUrl: '/hero/hero-2.png',
      heading: 'RAW HUMAN HAIR BUNDLES',
      subheading: 'Unprocessed Double Drawn Hair • Thick Full Ends',
      ctaText: 'Explore Bundles',
      ctaLink: '/category/bundles',
      sortOrder: 2,
      isActive: true,
    },
    {
      imageUrl: '/hero/hero-3.png',
      heading: 'HD CLOSURES & FRONTALS',
      subheading: 'Seamless Melt Technology • Pre-Plucked Hairline',
      ctaText: 'Shop Closures',
      ctaLink: '/category/closures',
      sortOrder: 3,
      isActive: true,
    },
  ]);

  await db.delete(testimonials);
  await db.insert(testimonials).values([
    {
      clientName: 'Chidinma O.',
      content: 'The Bone Straight HD Lace Wig is top tier! Zero shedding, melted completely like scalp.',
      rating: 5,
      imageUrl: null,
      isPublished: true,
    },
    {
      clientName: 'Amina K.',
      content: 'Bought 3 raw Cambodian bundles and a 5x5 closure. Super soft and bleached to 613 effortlessly!',
      rating: 5,
      imageUrl: null,
      isPublished: true,
    },
    {
      clientName: 'Blessing A.',
      content: 'Fast delivery to Lagos, WhatsApp admin was sweet and responsive. VIC ROYAL BEAUTY is my plug!',
      rating: 5,
      imageUrl: null,
      isPublished: true,
    },
  ]);

  console.log('SEED COMPLETE!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed fatal error:', err);
  process.exit(1);
});
