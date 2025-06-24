import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

/**
 * Server-side data access layer for transactions
 * IMPORTANT: This file should only be imported in server components or API routes
 */

/**
 * Get transactions with pagination and filtering
 */
export async function getTransactions(params: {
  page?: number;
  limit?: number;
  userId?: string;
  status?: string;
  type?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { 
    page = 1, 
    limit = 10, 
    userId, 
    status, 
    type, 
    search,
    startDate,
    endDate 
  } = params;
  const offset = (page - 1) * limit;

  // Build where clause
  const where: Prisma.TransactionWhereInput = {};

  // Add filters if provided
  if (userId) {
    where.user_id = userId;
  }

  if (status) {
    where.status = status;
  }

  if (type) {
    where.type = type;
  }

  // Add date range if provided
  if (startDate || endDate) {
    where.created_at = {};
    
    if (startDate) {
      where.created_at.gte = new Date(startDate);
    }
    
    if (endDate) {
      where.created_at.lte = new Date(endDate);
    }
  }

  // Add search if provided
  if (search) {
    where.OR = [
      { reference_id: { contains: search, mode: 'insensitive' } },
      // Note: User model doesn't have first_name or last_name fields in the schema
      // Only search by reference_id for now
    ];
  }

  // Get transactions with pagination
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        user: true,
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a transaction by ID
 */
export async function getTransactionById(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
}

/**
 * Update a transaction
 */
export async function updateTransaction(id: string, data: Prisma.TransactionUpdateInput) {
  return prisma.transaction.update({
    where: { id },
    data,
    include: {
      user: true,
    },
  });
}

/**
 * Create a new transaction
 */
export async function createTransaction(data: Prisma.TransactionCreateInput) {
  return prisma.transaction.create({
    data,
    include: {
      user: true,
    },
  });
}