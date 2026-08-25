import { db } from '../db';
import { sql } from 'drizzle-orm';

async function initDb() {
  console.log('Creating/Altering database tables in Neon PostgreSQL...');

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        price NUMERIC(12, 0) NOT NULL,
        compare_at_price NUMERIC(12, 0),
        images JSONB NOT NULL,
        category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        stock_status TEXT NOT NULL DEFAULT 'in_stock',
        is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
        is_featured BOOLEAN NOT NULL DEFAULT FALSE,
        is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
        search_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Ensure is_new_arrival column exists on existing products table
    await db.execute(sql`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE;
    `);
    console.log('✓ Products table & is_new_arrival column ready');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_name TEXT NOT NULL,
        content TEXT NOT NULL,
        rating INT,
        image_url TEXT,
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        image_url TEXT NOT NULL,
        heading TEXT NOT NULL,
        subheading TEXT NOT NULL,
        cta_text TEXT NOT NULL DEFAULT 'Shop Now',
        cta_link TEXT NOT NULL DEFAULT '/category/wigs',
        sort_order INT NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        delivery_address TEXT NOT NULL,
        notes TEXT,
        items JSONB NOT NULL,
        total_amount NUMERIC(12, 0) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS marketing_promos (
        id TEXT PRIMARY KEY DEFAULT 'global_promo_settings',
        ticker_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        ticker_text TEXT NOT NULL DEFAULT '⚡ FLASH PROMO: Get 15% OFF all Luxury Bone Straight Wigs & Bundles! Limited Time Only',
        ticker_discount_code TEXT DEFAULT 'ROYAL15',
        ticker_expires_at TIMESTAMP,
        ticker_cta_link TEXT NOT NULL DEFAULT '/category/wigs',
        ticker_cta_text TEXT NOT NULL DEFAULT 'Shop Now',
        popup_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        popup_heading TEXT NOT NULL DEFAULT 'EXCLUSIVE FLASH SALE ✨',
        popup_subheading TEXT NOT NULL DEFAULT 'Enjoy exclusive savings on 100% Raw Virgin Human Hair. Direct WhatsApp delivery nationwide.',
        popup_discount_tag TEXT NOT NULL DEFAULT 'UP TO 20% OFF',
        popup_image_url TEXT NOT NULL DEFAULT '/hero/hero-1.png',
        popup_cta_text TEXT NOT NULL DEFAULT 'Claim Discount Now',
        popup_cta_link TEXT NOT NULL DEFAULT '/category/wigs',
        popup_expires_at TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      INSERT INTO marketing_promos (id, ticker_enabled, popup_enabled)
      VALUES ('global_promo_settings', TRUE, FALSE)
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('ALL TABLES & COLUMNS SUCCESSFULLY INITIALIZED!');
  } catch (err) {
    console.error('Error initializing database tables:', err);
    process.exit(1);
  }
  process.exit(0);
}

initDb();
