import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Helper function to check admin permissions
async function checkAdminPermissions() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Check if user has admin role
  const userRole = sessionClaims?.metadata?.role || '';
  if (!['admin', 'super_admin', 'moderator'].includes(userRole)) {
    throw new Error('Insufficient permissions');
  }

  return { userId, role: userRole };
}

// Validation schemas
const getUsersSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('25'),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'updated_at']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export async function GET(request: NextRequest) {
  try {
    await checkAdminPermissions();

    const { searchParams } = new URL(request.url);
    const params = getUsersSchema.parse(Object.fromEntries(searchParams));

    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (params.search) {
      where.clerk_id = { contains: params.search, mode: 'insensitive' };
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          clerk_id: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          [params.sort_by]: params.sort_order,
        },
        skip: offset,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Since we don't have user details in our database, we'll need to fetch them from Clerk
    // For now, we'll just return the basic user data we have
    const enhancedUsers = users.map(user => ({
      ...user,
      // These fields would normally come from Clerk API
      email: `user-${user.clerk_id}@example.com`, // Placeholder
      first_name: 'User', // Placeholder
      last_name: user.clerk_id.substring(0, 8), // Placeholder
      full_name: `User ${user.clerk_id.substring(0, 8)}`, // Placeholder
      is_online: false, // Placeholder
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        users: enhancedUsers,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    
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
        { success: false, message: 'Invalid parameters', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new user (admin only)
const createUserSchema = z.object({
  clerk_id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    await checkAdminPermissions();
    
    const body = await request.json();
    const userData = createUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerk_id: userData.clerk_id },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this clerk_id already exists' },
        { status: 409 }
      );
    }

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        clerk_id: userData.clerk_id,
      },
      select: {
        id: true,
        clerk_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Create user error:', error);
    
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
        { success: false, message: 'Invalid user data', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}