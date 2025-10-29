import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { ProductModel } from "../lib/generated/prisma/models/Product";
import { PrismaClient } from "../lib/generated/prisma/client";
import ws from "ws";

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;

// Configuration for the connection pool.
const poolConfig = { connectionString: process.env.DATABASE_URL };

// Instantiates the Prisma adapter with the Neon pool configuration.
const adapter = new PrismaNeon(poolConfig);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
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
