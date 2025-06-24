import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Server-side data access layer for admin notifications
 * IMPORTANT: This file should only be imported in server components or API routes
 */

/**
 * Get all admin notifications with optional filtering
 */
export async function getAdminNotifications(params: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) {
  const { page = 1, limit = 10, unreadOnly } = params;
  const offset = (page - 1) * limit;

  // Build where clause
  const where: Prisma.AdminNotificationWhereInput = {};
  
  if (unreadOnly) {
    where.is_read = false;
  }

  // Get total count for pagination
  const totalCount = await prisma.adminNotification.count({ where });

  // Get notifications
  const notifications = await prisma.adminNotification.findMany({
    where,
    orderBy: { created_at: 'desc' },
    skip: offset,
    take: limit,
  });

  return {
    data: notifications,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

/**
 * Get a single admin notification by ID
 */
export async function getAdminNotificationById(id: string) {
  return prisma.adminNotification.findUnique({
    where: { id },
  });
}

/**
 * Create a new admin notification
 */
export async function createAdminNotification(data: {
  type: 'user_registration' | 'transaction_pending' | 'support_message' | 'system_alert';
  message: string;
  related_entity?: string;
  related_id?: string;
}) {
  return prisma.adminNotification.create({
    data: {
      type: data.type,
      message: data.message,
      related_entity: data.related_entity,
      related_id: data.related_id,
      is_read: false,
    },
  });
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(id: string) {
  return prisma.adminNotification.update({
    where: { id },
    data: { is_read: true },
  });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  return prisma.adminNotification.updateMany({
    where: { is_read: false },
    data: { is_read: true },
  });
}