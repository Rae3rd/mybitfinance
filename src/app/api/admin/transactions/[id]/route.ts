import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkAdminPermissions, checkRolePermissions } from '../../../../../lib/auth/server';
import { getTransactionById, updateTransaction } from '../../../../../lib/data/transactions';
import { prisma } from '../../../../../lib/prisma';

// Get single transaction
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user has admin permissions (including auditors who can read)
    await checkAdminPermissions();
    const transactionId = params.id;

    // Fetch the transaction using the data access layer
    const transaction = await getTransactionById(transactionId);

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Enhance transaction with user info
    const enhancedTransaction = {
      ...transaction,
      user: transaction.user
        ? {
            ...transaction.user,
            // User model doesn't have first_name/last_name fields, use clerk_id as identifier
            name: `User ${transaction.user.clerk_id}`,
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
    // Check if user has write permissions (excluding auditors)
    const { userId, role } = await checkRolePermissions(['admin', 'super_admin', 'moderator']);

    const transactionId = params.id;
    const body = await request.json();
    const updateData = updateTransactionSchema.parse(body);

    // Check if transaction exists
    const existingTransaction = await getTransactionById(transactionId);

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

    // Update transaction using the data access layer
    const updatedTransaction = await updateTransaction(transactionId, {
      status: updateData.status,
      processed_at: new Date(),
      metadata: {
        // Ensure metadata is treated as an object before spreading
        ...(typeof existingTransaction.metadata === 'object' && existingTransaction.metadata !== null ? existingTransaction.metadata : {}),
        admin_note: updateData.reason,
        processed_by: userId,
      },
    });

    // Log the action in audit trail
    await prisma.adminActivity.create({
      data: {
        admin_id: userId,
        action_type: 'OTHER',
        description: `Transaction ${transactionId} status changed to ${updateData.status}`,
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

    // Enhance transaction with user info
    const enhancedTransaction = {
      ...updatedTransaction,
      user: updatedTransaction.user
        ? {
            ...updatedTransaction.user,
            // User model doesn't have first_name/last_name fields, use clerk_id as identifier
            name: `User ${updatedTransaction.user.clerk_id}`,
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