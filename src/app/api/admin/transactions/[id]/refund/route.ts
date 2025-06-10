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
  const userRole = (sessionClaims?.metadata as { role?: string })?.role || '';
  if (!['admin', 'super_admin'].includes(userRole)) {
    throw new Error('Unauthorized: Only admins can process refunds');
  }

  return { userId, role: userRole as string };
}

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
    const { userId, role } = await checkAdminPermissions();

    const transactionId = params.id;
    const body = await request.json();
    const { reason } = refundSchema.parse(body);

    // Check if transaction exists and is eligible for refund
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

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

    // Create a new refund transaction
    const refundTransaction = await prisma.transaction.create({
      data: {
        user_id: existingTransaction.user_id,
        type: existingTransaction.type === 'deposit' ? 'withdrawal' : 'deposit',
        asset: existingTransaction.asset,
        amount: existingTransaction.amount,
        status: 'approved',
        reference_id: `refund-${existingTransaction.reference_id}`,
        processed_at: new Date(),
        metadata: {
          original_transaction_id: existingTransaction.id,
          refund_reason: reason,
          processed_by: userId,
        },
      },
    });

    // Update original transaction to mark as refunded
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
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
      },
    });

    // Log the action in admin activity
    await prisma.adminActivity.create({
      data: {
        admin_id: userId,
        action_type: 'SYSTEM_CONFIG',
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