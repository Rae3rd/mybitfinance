import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkAdminPermissions } from '@/lib/auth/server';
import { getTransactions } from '@/lib/data/transactions';

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
    
    // Get transactions using the data access layer
    const { transactions, pagination } = await getTransactions({
      page,
      limit,
      status: params.status,
      type: params.type,
      search: params.search,
      startDate: params.dateFrom,
      endDate: params.dateTo
    });

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination,
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