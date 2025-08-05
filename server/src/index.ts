
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  registerInputSchema,
  loginInputSchema,
  createPancakeInputSchema,
  updatePancakeInputSchema,
  createSizeInputSchema,
  createToppingInputSchema,
  updateToppingInputSchema,
  createOrderInputSchema,
  updateOrderStatusInputSchema
} from './schema';

// Import handlers
import { registerUser } from './handlers/register_user';
import { loginUser } from './handlers/login_user';
import { getPancakes } from './handlers/get_pancakes';
import { getPancakeById } from './handlers/get_pancake_by_id';
import { createPancake } from './handlers/create_pancake';
import { updatePancake } from './handlers/update_pancake';
import { getAdminPancakes } from './handlers/get_admin_pancakes';
import { createSize } from './handlers/create_size';
import { getSizesForPancake } from './handlers/get_sizes_for_pancake';
import { getToppings } from './handlers/get_toppings';
import { createTopping } from './handlers/create_topping';
import { updateTopping } from './handlers/update_topping';
import { getAdminToppings } from './handlers/get_admin_toppings';
import { createOrder } from './handlers/create_order';
import { getUserOrders } from './handlers/get_user_orders';
import { getAllOrders } from './handlers/get_all_orders';
import { updateOrderStatus } from './handlers/update_order_status';
import { getOrderById } from './handlers/get_order_by_id';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  register: publicProcedure
    .input(registerInputSchema)
    .mutation(({ input }) => registerUser(input)),

  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => loginUser(input)),

  // Customer-facing pancake routes
  getPancakes: publicProcedure
    .query(() => getPancakes()),

  getPancakeById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getPancakeById(input.id)),

  getSizesForPancake: publicProcedure
    .input(z.object({ pancakeId: z.number() }))
    .query(({ input }) => getSizesForPancake(input.pancakeId)),

  getToppings: publicProcedure
    .query(() => getToppings()),

  // Admin pancake management routes
  getAdminPancakes: publicProcedure
    .query(() => getAdminPancakes()),

  createPancake: publicProcedure
    .input(createPancakeInputSchema)
    .mutation(({ input }) => createPancake(input)),

  updatePancake: publicProcedure
    .input(updatePancakeInputSchema)
    .mutation(({ input }) => updatePancake(input)),

  createSize: publicProcedure
    .input(createSizeInputSchema)
    .mutation(({ input }) => createSize(input)),

  // Admin topping management routes
  getAdminToppings: publicProcedure
    .query(() => getAdminToppings()),

  createTopping: publicProcedure
    .input(createToppingInputSchema)
    .mutation(({ input }) => createTopping(input)),

  updateTopping: publicProcedure
    .input(updateToppingInputSchema)
    .mutation(({ input }) => updateTopping(input)),

  // Order routes
  createOrder: publicProcedure
    .input(createOrderInputSchema)
    .mutation(({ input }) => createOrder(input)),

  getUserOrders: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getUserOrders(input.userId)),

  getOrderById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getOrderById(input.id)),

  // Admin order management routes
  getAllOrders: publicProcedure
    .query(() => getAllOrders()),

  updateOrderStatus: publicProcedure
    .input(updateOrderStatusInputSchema)
    .mutation(({ input }) => updateOrderStatus(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
