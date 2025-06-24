import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { withRetry } from '@/lib/db-connect';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TransactionWhereInput = {
      user_id: userId,
    };

    // Add type filter if provided
    if (type) {
      where.type = type;
    }

    // Add status filter if provided
    if (status) {
      where.status = status;
    }

    // Use withRetry for database operations
    const [transactions, total] = await Promise.all([
      withRetry(() => prisma.transaction.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
        skip: offset,
        take: limit,
      })),
      withRetry(() => prisma.transaction.count({ where })),
    ]);

    // Format transactions for frontend
    const formattedTransactions = transactions.map((transaction) => {
      return {
        id: transaction.id,
        type: transaction.type,
        asset: transaction.asset || 'Unknown',
        assetName: transaction.asset,
        amount: transaction.amount,
        fee: transaction.fee,
        status: transaction.status,
        referenceId: transaction.reference_id,
        createdAt: transaction.created_at.toISOString(),
        processedAt: transaction.processed_at?.toISOString() || null,
      };
    });

    return NextResponse.json({
      transactions: formattedTransactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    
    // Handle different types of Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P1001') {
        return NextResponse.json(
          { error: 'Database connection error. Please try again later.' },
          { status: 503 }
        );
      }
      if (error.code === 'P2001') {
        return NextResponse.json(
          { error: 'Record not found.' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}