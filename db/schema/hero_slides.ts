import { pgTable, uuid, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const heroSlides = pgTable('hero_slides', {
  id: uuid('id').defaultRandom().primaryKey(),
  imageUrl: text('image_url').notNull(),
  heading: text('heading').notNull(),
  subheading: text('subheading').notNull(),
  ctaText: text('cta_text').default('Shop Now').notNull(),
  ctaLink: text('cta_link').default('/category/wigs').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
