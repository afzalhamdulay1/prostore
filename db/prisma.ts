import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { ProductModel } from "../lib/generated/prisma/models/Product";

// PrismaNeon expects a pool config with connectionString
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!, // ✅ Pass string directly
});

// Create extended Prisma client
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

// Singleton pattern
declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma =
  global.prisma ||
  (() => {
    const client = createPrismaClient();
    if (process.env.NODE_ENV !== "production") global.prisma = client;
    return client;
  })();
