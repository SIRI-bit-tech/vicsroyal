import { pgTable, uuid, text, numeric, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { OrderItemSnapshot } from '../../types/order';

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerName: text('customer_name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  notes: text('notes'),
  items: jsonb('items').$type<OrderItemSnapshot[]>().notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 0 }).notNull(), // Whole naira
  status: text('status', { enum: ['pending', 'contacted', 'fulfilled', 'abandoned'] }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
