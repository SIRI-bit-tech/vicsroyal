import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const marketingPromos = pgTable('marketing_promos', {
  id: text('id').primaryKey().default('global_promo_settings'),
  // Scroll Ticker
  tickerEnabled: boolean('ticker_enabled').default(true).notNull(),
  tickerText: text('ticker_text').default('⚡ FLASH PROMO: Get 15% OFF all Luxury Bone Straight Wigs & Bundles! Limited Time Only').notNull(),
  tickerDiscountCode: text('ticker_discount_code').default('ROYAL15'),
  tickerExpiresAt: timestamp('ticker_expires_at'),
  tickerCtaLink: text('ticker_cta_link').default('/category/wigs').notNull(),
  tickerCtaText: text('ticker_cta_text').default('Shop Now').notNull(),

  // Pop-up Ad Modal
  popupEnabled: boolean('popup_enabled').default(false).notNull(),
  popupHeading: text('popup_heading').default('EXCLUSIVE FLASH SALE ✨').notNull(),
  popupSubheading: text('popup_subheading').default('Enjoy exclusive savings on 100% Raw Virgin Human Hair. Direct WhatsApp delivery nationwide.').notNull(),
  popupDiscountTag: text('popup_discount_tag').default('UP TO 20% OFF').notNull(),
  popupImageUrl: text('popup_image_url').default('/hero/hero-1.png').notNull(),
  popupCtaText: text('popup_cta_text').default('Claim Discount Now').notNull(),
  popupCtaLink: text('popup_cta_link').default('/category/wigs').notNull(),
  popupExpiresAt: timestamp('popup_expires_at'),

  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
