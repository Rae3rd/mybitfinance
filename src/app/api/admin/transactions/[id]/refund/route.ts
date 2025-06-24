import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRolePermissions } from '@/lib/auth/server';
import { getTransactionById, createTransaction, updateTransaction } from '@/lib/data/transactions';
import { prisma } from '@/lib/prisma';

// Schema for refund request
const refundSchema = z.object({
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
});

// Process refund for a transaction
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user has admin permissions (only admin and super_admin can refund)
    const { userId, role } = await checkRolePermissions(['admin', 'super_admin']);

    const transactionId = params.id;
    const body = await request.json();
    const { reason } = refundSchema.parse(body);

    // Check if transaction exists and is eligible for refund
    const existingTransaction = await getTransactionById(transactionId);

    if (!existingTransaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Only approved transactions can be refunded
    if (existingTransaction.status !== 'approved') {
      return NextResponse.json(
        {
          success: false,
          message: 'Only approved transactions can be refunded',
        },
        { status: 400 }
      );
    }

    // Only deposits and withdrawals can be refunded
    if (!['deposit', 'withdrawal'].includes(existingTransaction.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Only deposits and withdrawals can be refunded',
        },
        { status: 400 }
      );
    }

    // Create a new refund transaction using the data access layer
    const refundTransaction = await createTransaction({
      user: { connect: { id: existingTransaction.user_id } },
      type: existingTransaction.type === 'deposit' ? 'withdrawal' : 'deposit',
      asset: existingTransaction.asset, // Use the asset string directly
      amount: existingTransaction.amount,
      status: 'approved',
      reference_id: `refund-${existingTransaction.reference_id}`,
      processed_at: new Date(),
      metadata: {
        original_transaction_id: existingTransaction.id,
        refund_reason: reason,
        processed_by: userId,
      },
    });

    // Update original transaction to mark as refunded
    const updatedTransaction = await updateTransaction(transactionId, {
      status: 'refunded',
      metadata: existingTransaction.metadata && typeof existingTransaction.metadata === 'object' ? {
        ...(existingTransaction.metadata as Record<string, any>),
        refunded_at: new Date(),
        refund_reason: reason,
        refund_transaction_id: refundTransaction.id,
        refunded_by: userId,
      } : {
        refunded_at: new Date(),
        refund_reason: reason,
        refund_transaction_id: refundTransaction.id,
        refunded_by: userId,
      },
    });

    // Log the action in admin activity
    await prisma.adminActivity.create({
      data: {
        admin_id: userId,
        action_type: 'SYSTEM_CONFIG',
        description: `Refunded transaction ${transactionId}`, // Add required description field
        details: {
          action: 'transaction_refund',
          target_type: 'transaction',
          target_id: transactionId,
          old_value: JSON.stringify(existingTransaction),
          new_value: JSON.stringify(updatedTransaction),
          reason,
          refund_transaction_id: refundTransaction.id,
        },
      },
    });

    // Return transaction data
    const responseData = {
      ...updatedTransaction,
      refund_transaction: refundTransaction,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Transaction refunded successfully',
    });
  } catch (error) {
    console.error('Refund transaction error:', error);

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
          message: 'Invalid refund data',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to process refund' },
      { status: 500 }
    );
  }
}