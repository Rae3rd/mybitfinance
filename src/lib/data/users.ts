import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Server-side data access layer for users
 * IMPORTANT: This file should only be imported in server components or API routes
 */

/**
 * Get a user by their Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerk_id: clerkId },
  });
}

/**
 * Get a user by their database ID
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

/**
 * Get users with pagination and filtering
 */
export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  kycStatus?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}) {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    status, 
    kycStatus,
    sort_by = 'created_at',
    sort_order = 'desc'
  } = params;
  const offset = (page - 1) * limit;

  // Build where clause
  const where: Prisma.UserWhereInput = {};

  // Add filters if provided
  // Since status and kyc_status are not directly on UserWhereInput,
  // we need to use a different approach or remove these filters
  
  // Add search if provided
  if (search) {
    where.OR = [
      // Use clerk_id for search since it's available in the schema
      { clerk_id: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Get users with pagination
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        [sort_by]: sort_order,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

/**
 * Update a user
 */
export async function updateUser(id: string, data: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}