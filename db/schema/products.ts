import { pgTable, uuid, text, numeric, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { categories } from './categories';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 12, scale: 0 }).notNull(), // Whole naira
  compareAtPrice: numeric('compare_at_price', { precision: 12, scale: 0 }),
  images: jsonb('images').$type<string[]>().notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
  stockStatus: text('stock_status', { enum: ['in_stock', 'low_stock', 'out_of_stock'] }).default('in_stock').notNull(),
  isBestSeller: boolean('is_best_seller').default(false).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isNewArrival: boolean('is_new_arrival').default(false).notNull(),
  searchTags: jsonb('search_tags').$type<string[]>().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
