import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Helper function to check admin permissions
async function checkAdminPermissions(req: NextRequest): Promise<{ userId: string; role: string }> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error('Unauthorized: Not authenticated');
  }

  // Check if user has admin role
  const userRole = (sessionClaims?.metadata as Record<string, unknown>)?.role as string | undefined;
  if (!userRole || !['admin', 'super_admin', 'moderator', 'auditor'].includes(userRole)) {
    throw new Error('Unauthorized: Insufficient permissions');
  }

  // Auditors can only read data, not modify it
  if (userRole === 'auditor') {
    throw new Error('Unauthorized: Auditors have read-only access');
  }

  return { userId, role: userRole };
}

// Get single transaction
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId, role } = await checkAdminPermissions(req);
    const transactionId = params.id;

    // Fetch the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
            country: true,
          }
        }
      }
    }) as unknown as {
      id: string;
      user_id: string;
      type: string;
      asset: string;
      amount: number;
      fee: number;
      status: string;
      reference_id: string;
      metadata: any;
      created_at: Date;
      processed_at: Date | null;
      user: {
        id: string;
        email: string;
        first_name: string | null;
        last_name: string | null;
        phone: string | null;
        country: string | null;
      };
    };

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Enhance transaction with user name
    const enhancedTransaction = {
      ...transaction,
      user: transaction.user
        ? {
            ...(transaction.user as Record<string, any>),
            name: `${(transaction.user as Record<string, any>).first_name || ''} ${(transaction.user as Record<string, any>).last_name || ''}`.trim(),
          }
        : undefined,
    };

    return NextResponse.json({
      success: true,
      data: enhancedTransaction,
    });
  } catch (error) {
    console.error('Get transaction error:', error);

    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// Update transaction status
const updateTransactionSchema = z.object({
  status: z.enum(['approved', 'declined']),
  reason: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, role } = await checkAdminPermissions(request);

    const transactionId = params.id;
    const body = await request.json();
    const updateData = updateTransactionSchema.parse(body);

    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        user: {
          select: {
            id: true
          }
        }
      }
    }) as unknown as {
      id: string;
      user_id: string;
      type: string;
      asset: string;
      amount: number;
      fee: number;
      status: string;
      reference_id: string;
      metadata: any;
      created_at: Date;
      processed_at: Date | null;
      user: {
        id: string;
      };
    };

    if (!existingTransaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Only super_admin and admin can approve high-value transactions
    if (
      updateData.status === 'approved' &&
      existingTransaction.amount > 10000 &&
      !['super_admin', 'admin'].includes(role)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Only admins can approve high-value transactions',
        },
        { status: 403 }
      );
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: updateData.status,
        processed_at: new Date(),
        metadata: {
          ...(existingTransaction.metadata ? (existingTransaction.metadata as Record<string, any>) : {}),
          admin_note: updateData.reason,
          processed_by: userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          }
        }
      }
    }) as unknown as {
      id: string;
      user_id: string;
      type: string;
      asset: string;
      amount: number;
      fee: number;
      status: string;
      reference_id: string;
      metadata: any;
      created_at: Date;
      processed_at: Date;
      user: {
        id: string;
        email: string;
        first_name: string | null;
        last_name: string | null;
      };
    };

    // Log the action in audit trail
    await prisma.adminActivity.create({
      data: {
        admin_id: userId,
        action_type: 'OTHER',
        details: {
          action: `transaction_${updateData.status}`,
          target_type: 'transaction',
          target_id: transactionId,
          old_value: JSON.stringify(existingTransaction),
          new_value: JSON.stringify(updatedTransaction),
          reason: updateData.reason
        },
      },
    });

    // Enhance transaction with user name
    const enhancedTransaction = {
      ...updatedTransaction,
      user: updatedTransaction.user
        ? {
            ...(updatedTransaction.user as Record<string, any>),
            name: `${(updatedTransaction.user as Record<string, any>).first_name || ''} ${(updatedTransaction.user as Record<string, any>).last_name || ''}`.trim(),
          }
        : undefined,
    };

    return NextResponse.json({
      success: true,
      data: enhancedTransaction,
      message: `Transaction ${updateData.status} successfully`,
    });
  } catch (error) {
    console.error('Update transaction error:', error);

    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid transaction data',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}