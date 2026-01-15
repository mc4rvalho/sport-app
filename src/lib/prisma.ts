import { PrismaClient } from "@prisma/client";

// Evita múltiplas instâncias do Prisma no hot-reload do Next.js (Dev mode)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Loga as queries no terminal (útil para debug)
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
