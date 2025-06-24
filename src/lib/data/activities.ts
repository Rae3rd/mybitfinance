import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Server-side data access layer for activities
 * IMPORTANT: This file should only be imported in server components or API routes
 */

/**
 * Get activities for a specific user
 */
export async function getUserActivities(userId: string, limit: number = 10) {
  return prisma.activity.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: limit,
    include: {
      asset: true,
    },
  });
}

/**
 * Get activities with pagination and filtering
 */
export async function getActivities(params: {
  page?: number;
  limit?: number;
  userId?: string;
  type?: string;
}) {
  const { page = 1, limit = 10, userId, type } = params;
  const offset = (page - 1) * limit;

  // Build where clause
  const where: Prisma.ActivityWhereInput = {};

  // Add filters if provided
  if (userId) {
    where.user_id = userId;
  }

  if (type) {
    where.type = type;
  }

  // Get activities with pagination
  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        asset: true,
        user: true,
      },
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    activities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Create a new activity
 */
export async function createActivity(data: Prisma.ActivityCreateInput) {
  return prisma.activity.create({
    data,
    include: {
      asset: true,
    },
  });
}