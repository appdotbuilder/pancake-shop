
import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string().nullable(),
  is_admin: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Auth schemas
export const registerInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().nullable()
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Pancake schema
export const pancakeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  base_price: z.number(),
  ingredients: z.string(),
  image_url: z.string().nullable(),
  is_available: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Pancake = z.infer<typeof pancakeSchema>;

export const createPancakeInputSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  base_price: z.number().positive(),
  ingredients: z.string(),
  image_url: z.string().nullable(),
  is_available: z.boolean().default(true)
});

export type CreatePancakeInput = z.infer<typeof createPancakeInputSchema>;

export const updatePancakeInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  base_price: z.number().positive().optional(),
  ingredients: z.string().optional(),
  image_url: z.string().nullable().optional(),
  is_available: z.boolean().optional()
});

export type UpdatePancakeInput = z.infer<typeof updatePancakeInputSchema>;

// Size schema
export const sizeSchema = z.object({
  id: z.number(),
  pancake_id: z.number(),
  name: z.string(),
  price_multiplier: z.number(),
  created_at: z.coerce.date()
});

export type Size = z.infer<typeof sizeSchema>;

export const createSizeInputSchema = z.object({
  pancake_id: z.number(),
  name: z.string().min(1),
  price_multiplier: z.number().positive()
});

export type CreateSizeInput = z.infer<typeof createSizeInputSchema>;

// Topping schema
export const toppingSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  is_available: z.boolean(),
  created_at: z.coerce.date()
});

export type Topping = z.infer<typeof toppingSchema>;

export const createToppingInputSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  is_available: z.boolean().default(true)
});

export type CreateToppingInput = z.infer<typeof createToppingInputSchema>;

export const updateToppingInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  is_available: z.boolean().optional()
});

export type UpdateToppingInput = z.infer<typeof updateToppingInputSchema>;

// Order status enum
export const orderStatusEnum = z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']);
export type OrderStatus = z.infer<typeof orderStatusEnum>;

// Order schema
export const orderSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  total_amount: z.number(),
  status: orderStatusEnum,
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Order = z.infer<typeof orderSchema>;

export const createOrderInputSchema = z.object({
  user_id: z.number(),
  items: z.array(z.object({
    pancake_id: z.number(),
    size_id: z.number().nullable(),
    quantity: z.number().int().positive(),
    topping_ids: z.array(z.number()).default([])
  })),
  notes: z.string().nullable()
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const updateOrderStatusInputSchema = z.object({
  id: z.number(),
  status: orderStatusEnum
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusInputSchema>;

// Order item schema
export const orderItemSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  pancake_id: z.number(),
  size_id: z.number().nullable(),
  quantity: z.number().int(),
  unit_price: z.number(),
  created_at: z.coerce.date()
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// Order item topping schema
export const orderItemToppingSchema = z.object({
  id: z.number(),
  order_item_id: z.number(),
  topping_id: z.number(),
  topping_price: z.number(),
  created_at: z.coerce.date()
});

export type OrderItemTopping = z.infer<typeof orderItemToppingSchema>;

// Cart schemas for frontend state management
export const cartItemSchema = z.object({
  pancake_id: z.number(),
  size_id: z.number().nullable(),
  quantity: z.number().int().positive(),
  topping_ids: z.array(z.number()).default([])
});

export type CartItem = z.infer<typeof cartItemSchema>;
