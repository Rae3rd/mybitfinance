import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Connection options with retry logic and better error handling
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Connection options like timeouts should be set via DATABASE_URL parameters
    // Example: postgresql://user:password@host:port/db?connect_timeout=30&pool_timeout=30
    // See: https://www.prisma.io/docs/concepts/database-connectors/postgresql
  });
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Add error handling for common database connection issues
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error: any) {
    // Log database connection errors
    if (error.code === 'P1001' || error.code === 'P1002') {
      console.error('Database connection error:', error);
      // You could implement retry logic here if needed
    }
    throw error;
  }
});

export default prisma;