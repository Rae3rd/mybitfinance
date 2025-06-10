import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Helper function to check admin permissions
async function checkAdminPermissions() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error('Unauthorized: Not authenticated');
  }

  // Check if user has admin role
  const userRole = sessionClaims?.metadata?.role;
  if (!['admin', 'super_admin', 'moderator', 'auditor'].includes(userRole as string)) {
    throw new Error('Unauthorized: Insufficient permissions');
  }

  return { userId, role: userRole as string };
}

// Schema for transaction query parameters
const getTransactionsSchema = z.object({
  page: z.string().default('1'),
  limit: z.string().default('10'),
  status: z.string().optional(),
  type: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

// GET transactions with filters and pagination
export async function GET(request: NextRequest) {
  try {
    await checkAdminPermissions();

    const { searchParams } = new URL(request.url);
    const params = getTransactionsSchema.parse(Object.fromEntries(searchParams));

    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const offset = (page - 1) * limit;

    // Build where clause based on filters
    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.type) {
      where.type = params.type;
    }

    if (params.dateFrom || params.dateTo) {
      where.created_at = {};
      
      if (params.dateFrom) {
        where.created_at.gte = new Date(params.dateFrom);
      }
      
      if (params.dateTo) {
        where.created_at.lte = new Date(params.dateTo);
      }
    }

    // Search by reference_id only since user relation doesn't exist
    if (params.search) {
      where.reference_id = { contains: params.search, mode: 'insensitive' };
    }

    // Get transactions with pagination
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid query parameters', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}