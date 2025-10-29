import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { ProductModel } from "../lib/generated/prisma/models/Product";
import { PrismaClient } from "../lib/generated/prisma/client";
import ws from "ws";

// Set up WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Neon connection pool config
const poolConfig = { connectionString: process.env.DATABASE_URL };
const adapter = new PrismaNeon(poolConfig);

// TypeScript: allow global to hold extended client
type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

function createPrismaClient() {
  return new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: {
          compute(product: ProductModel) {
            return product.price.toString();
          },
        },
        rating: {
          compute(product: ProductModel) {
            return product.rating.toString();
          },
        },
      },
    },
  });
}

// Extend globalThis to hold the Prisma client
declare global {
  var prisma: ExtendedPrismaClient | undefined;
}

// Reuse client in development
export const prisma =
  global.prisma ||
  (() => {
    const client = createPrismaClient();
    if (process.env.NODE_ENV !== "production") global.prisma = client;
    return client;
  })();
