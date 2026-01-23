import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../lib/generated/prisma/client";
import ws from "ws";
import dotenv from "dotenv";

dotenv.config();

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;

// Configuration for the connection pool.
const poolConfig = { connectionString: process.env.DATABASE_URL };

// Instantiates the Prisma adapter with the Neon pool configuration.
const adapter = new PrismaNeon(poolConfig);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: {
          compute(product: any) {
            return product.price.toString();
          },
        },
        rating: {
          compute(product: any) {
            return product.rating.toString();
          },
        },
      },
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
