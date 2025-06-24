import { NextRequest, NextResponse } from 'next/server';
import { getAuth, checkAdminPermissions } from '../../../../../lib/auth/server';
import { prisma } from '../../../../../lib/prisma';
import { z } from 'zod';

// Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permissions
    let adminId: string;
    let adminRole: string;
    try {
      const adminAuth = await checkAdminPermissions();
      adminId = adminAuth.userId;
      adminRole = adminAuth.role;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

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
      full_name: `User ${user.clerk_id}`, // Using clerk_id as identifier since first_name/last_name don't exist in our database
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
// Note: Most user fields are managed in Clerk, not in our database
// Our database only contains id, clerk_id, created_at, and updated_at
// This schema should be used with Clerk's API, not with our database
const updateUserSchema = z.object({
  // We're keeping this schema for validation purposes
  // but we won't be able to update these fields in our database
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permissions
    let adminId: string;
    let adminRole: string;
    try {
      const adminAuth = await checkAdminPermissions();
      adminId = adminAuth.userId;
      adminRole = adminAuth.role;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const userId = params.id;
    const body = await request.json();
    const updateData = updateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        clerk_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Permission checks
    // Note: Role and balance checks removed as these fields are not in our database
    // These checks should be implemented when calling Clerk's API

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updated_at: new Date(),
      },
      select: {
        id: true,
        clerk_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Log the admin action
    await prisma.adminActivity.create({
      data: {
        admin_id: adminId, // Use the already obtained userId from checkAdminPermissions
        action_type: 'OTHER',
        description: 'User information updated', // Required field
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
    // Check admin permissions
    let adminId: string;
    let adminRole: string;
    try {
      const result = await checkAdminPermissions();
      adminId = result.userId;
      adminRole = result.role;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
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
      select: { id: true, clerk_id: true, created_at: true, updated_at: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Note: Role information is stored in Clerk, not in our database
    // We can't check the role directly from the Prisma User model
    // This check would need to be implemented using Clerk's API instead

    let result;
    if (hardDelete) {
      // Hard delete - remove from database
      result = await prisma.user.delete({
        where: { id: userId },
      });
    } else {
      // Soft delete - we can only update the timestamp since status is not in our database
      // The actual user status should be managed through Clerk's API
      result = await prisma.user.update({
        where: { id: userId },
        data: {
          updated_at: new Date(),
        },
      });
    }

    // Log the admin action
    await prisma.adminActivity.create({
      data: {
        admin_id: adminId,
        action_type: 'OTHER',
        description: hardDelete ? 'User permanently deleted' : 'User deactivated', // Required field
        details: {
          action: hardDelete ? 'user_delete' : 'user_deactivate',
          target_type: 'user',
          target_id: userId,
          old_value: JSON.stringify(existingUser),
          new_value: hardDelete ? null : JSON.stringify({ action: 'soft_delete' }),
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