
import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Order status enum
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  phone: text('phone'),
  is_admin: boolean('is_admin').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Pancakes table
export const pancakesTable = pgTable('pancakes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  base_price: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  ingredients: text('ingredients').notNull(),
  image_url: text('image_url'),
  is_available: boolean('is_available').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Sizes table (for different pancake sizes)
export const sizesTable = pgTable('sizes', {
  id: serial('id').primaryKey(),
  pancake_id: integer('pancake_id').notNull().references(() => pancakesTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // e.g., "Small", "Medium", "Large"
  price_multiplier: numeric('price_multiplier', { precision: 3, scale: 2 }).notNull(), // e.g., 1.0, 1.5, 2.0
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Toppings table
export const toppingsTable = pgTable('toppings', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: numeric('price', { precision: 8, scale: 2 }).notNull(),
  is_available: boolean('is_available').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Orders table
export const ordersTable = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Order items table
export const orderItemsTable = pgTable('order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => ordersTable.id, { onDelete: 'cascade' }),
  pancake_id: integer('pancake_id').notNull().references(() => pancakesTable.id),
  size_id: integer('size_id').references(() => sizesTable.id),
  quantity: integer('quantity').notNull(),
  unit_price: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Order item toppings table (many-to-many relationship)
export const orderItemToppingsTable = pgTable('order_item_toppings', {
  id: serial('id').primaryKey(),
  order_item_id: integer('order_item_id').notNull().references(() => orderItemsTable.id, { onDelete: 'cascade' }),
  topping_id: integer('topping_id').notNull().references(() => toppingsTable.id),
  topping_price: numeric('topping_price', { precision: 8, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  orders: many(ordersTable),
}));

export const pancakesRelations = relations(pancakesTable, ({ many }) => ({
  sizes: many(sizesTable),
  orderItems: many(orderItemsTable),
}));

export const sizesRelations = relations(sizesTable, ({ one, many }) => ({
  pancake: one(pancakesTable, {
    fields: [sizesTable.pancake_id],
    references: [pancakesTable.id],
  }),
  orderItems: many(orderItemsTable),
}));

export const toppingsRelations = relations(toppingsTable, ({ many }) => ({
  orderItemToppings: many(orderItemToppingsTable),
}));

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.user_id],
    references: [usersTable.id],
  }),
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one, many }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.order_id],
    references: [ordersTable.id],
  }),
  pancake: one(pancakesTable, {
    fields: [orderItemsTable.pancake_id],
    references: [pancakesTable.id],
  }),
  size: one(sizesTable, {
    fields: [orderItemsTable.size_id],
    references: [sizesTable.id],
  }),
  toppings: many(orderItemToppingsTable),
}));

export const orderItemToppingsRelations = relations(orderItemToppingsTable, ({ one }) => ({
  orderItem: one(orderItemsTable, {
    fields: [orderItemToppingsTable.order_item_id],
    references: [orderItemsTable.id],
  }),
  topping: one(toppingsTable, {
    fields: [orderItemToppingsTable.topping_id],
    references: [toppingsTable.id],
  }),
}));

// Export all tables
export const tables = {
  users: usersTable,
  pancakes: pancakesTable,
  sizes: sizesTable,
  toppings: toppingsTable,
  orders: ordersTable,
  orderItems: orderItemsTable,
  orderItemToppings: orderItemToppingsTable,
};
