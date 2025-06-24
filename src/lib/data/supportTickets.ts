import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Server-side data access layer for support tickets
 * IMPORTANT: This file should only be imported in server components or API routes
 */

/**
 * Get support tickets with pagination and filtering
 */
export async function getSupportTickets(params: {
  page?: number;
  limit?: number;
  userId?: string;
  status?: string;
  search?: string;
}) {
  const { page = 1, limit = 10, userId, status, search } = params;
  const offset = (page - 1) * limit;

  // Build where clause
  const where: Prisma.SupportTicketWhereInput = {};

  // Add filters if provided
  if (userId) {
    where.user_id = userId;
  }

  if (status) {
    where.status = status;
  }

  // Add search if provided
  if (search) {
    where.OR = [
      { subject: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { user: { first_name: { contains: search, mode: 'insensitive' } } },
      { user: { last_name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Get support tickets with pagination
  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        user: true,
        messages: {
          orderBy: { created_at: 'asc' },
          include: {
            user: true,
          },
        },
      },
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a support ticket by ID
 */
export async function getSupportTicketById(id: string) {
  return prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: true,
      messages: {
        orderBy: { created_at: 'asc' },
        include: {
          user: true,
        },
      },
    },
  });
}

/**
 * Update a support ticket
 */
export async function updateSupportTicket(id: string, data: Prisma.SupportTicketUpdateInput) {
  return prisma.supportTicket.update({
    where: { id },
    data,
    include: {
      user: true,
      messages: {
        orderBy: { created_at: 'asc' },
        include: {
          user: true,
        },
      },
    },
  });
}

/**
 * Add a message to a support ticket
 */
export async function addSupportTicketMessage(ticketId: string, data: {
  user_id: string;
  message: string;
  is_admin: boolean;
}) {
  return prisma.supportTicketMessage.create({
    data: {
      support_ticket_id: ticketId,
      user_id: data.user_id,
      message: data.message,
      is_admin: data.is_admin,
    },
  });
}

/**
 * Create a new support ticket
 */
export async function createSupportTicket(data: {
  user_id: string;
  subject: string;
  description: string;
  priority?: string;
  category?: string;
}) {
  return prisma.supportTicket.create({
    data: {
      user_id: data.user_id,
      subject: data.subject,
      description: data.description,
      priority: data.priority || 'medium',
      category: data.category || 'general',
      status: 'open',
    },
    include: {
      user: true,
    },
  });
}