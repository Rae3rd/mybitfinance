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
  const userRole = sessionClaims?.metadata?.role as string | undefined;
  if (!userRole || !['admin', 'super_admin', 'moderator', 'auditor'].includes(userRole)) {
    throw new Error('Unauthorized: Insufficient permissions');
  }

  // Auditors can only read data, not modify it
  if (userRole === 'auditor') {
    throw new Error('Unauthorized: Auditors have read-only access');
  }

  return { userId, role: userRole };
}

// Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: adminId, role: adminRole } = await checkAdminPermissions(request);

    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: {
          orderBy: { created_at: 'desc' },
          take: 10,
          select: {
            id: true,
            type: true,
            asset: true,
            amount: true,
            status: true,
            created_at: true,
            processed_at: true,
          },
        },
        portfolios: {
          select: {
            id: true,
            plan_name: true,
            investment_amount: true,
            current_value: true,
            roi_percentage: true,
            status: true,
            created_at: true,
          },
        },
        supportTickets: {
          orderBy: { created_at: 'desc' },
          take: 5,
          select: {
            id: true,
            subject: true,
            status: true,
            created_at: true,
            updated_at: true,
          },
        },
      } as any, // Type assertion needed because Transaction model doesn't have a proper relation with User in the schema
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate online status
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const isOnline = (user as any).last_active_at && (user as any).last_active_at >= fifteenMinutesAgo;

    // Calculate portfolio summary
    const portfolioSummary = {
      totalInvested: (user as any).portfolios.reduce((sum: number, p: any) => sum + p.investment_amount, 0),
      totalValue: (user as any).portfolios.reduce((sum: number, p: any) => sum + p.current_value, 0),
      activePortfolios: (user as any).portfolios.filter((p: any) => p.status === 'active').length,
    };

    const enhancedUser = {
      ...user,
      is_online: isOnline,
      full_name: `${(user as any).first_name} ${(user as any).last_name}`.trim(),
      portfolio_summary: portfolioSummary,
    };

    return NextResponse.json({
      success: true,
      data: enhancedUser,
    });
  } catch (error) {
    console.error('Get user error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user
const updateUserSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  role: z.enum(['user', 'admin', 'moderator', 'auditor']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  kyc_status: z.enum(['verified', 'pending', 'rejected']).optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  total_balance_usd: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: adminId, role: adminRole } = await checkAdminPermissions(request);
    
    const userId = params.id;
    const body = await request.json();
    const updateData = updateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        status: true,
        kyc_status: true,
        phone: true,
        country: true,
        total_balance_usd: true,
        updated_at: true,
      } as any,
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Permission checks
    if (updateData.role && updateData.role !== 'user' && adminRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Only super admins can modify admin roles' },
        { status: 403 }
      );
    }

    if (updateData.total_balance_usd !== undefined && adminRole === 'moderator') {
      return NextResponse.json(
        { success: false, message: 'Moderators cannot modify user balances' },
        { status: 403 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        status: true,
        kyc_status: true,
        phone: true,
        country: true,
        total_balance_usd: true,
        updated_at: true,
      },
    });

    // Log the admin action
    await prisma.adminActivity.create({
      data: {
        admin_id: adminId, // Use the already obtained userId from checkAdminPermissions
        action_type: 'OTHER',
        details: {
          action: 'user_update',
          target_type: 'user',
          target_id: userId,
          old_value: JSON.stringify(existingUser),
          new_value: JSON.stringify(updateData),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid update data', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete/Deactivate user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: adminId, role: adminRole } = await checkAdminPermissions(request);
    
    const userId = params.id;
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';

    // Only super_admin can perform hard deletes
    if (hardDelete && adminRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Only super admins can permanently delete users' },
        { status: 403 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, status: true } as any,
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deletion of admin users by non-super_admins
    if ((existingUser as any).role !== 'user' && adminRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    let result;
    if (hardDelete) {
      // Hard delete - remove from database
      result = await prisma.user.delete({
        where: { id: userId },
      });
    } else {
      // Soft delete - mark as inactive
      result = await prisma.user.update({
        where: { id: userId },
        data: {
          status: 'inactive',
          updated_at: new Date(),
        } as any,
      });
    }

    // Log the admin action
    await prisma.adminActivity.create({
      data: {
        admin_id: adminId,
        action_type: 'OTHER',
        details: {
          action: hardDelete ? 'user_delete' : 'user_deactivate',
          target_type: 'user',
          target_id: userId,
          old_value: JSON.stringify(existingUser),
          new_value: hardDelete ? null : JSON.stringify({ status: 'inactive' }),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: hardDelete ? 'User deleted permanently' : 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}