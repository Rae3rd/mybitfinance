import { NextRequest, NextResponse } from 'next/server';
import { getAuth, checkAdminPermissions } from '@/lib/auth/server';
import { getUsers, getUserById, updateUser, deleteUser, getUserByClerkId } from '@/lib/data/users';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
    // Get auth session
    const auth = await getAuth();
    
    // Check if user is authenticated
    if (!auth?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin permissions
    try {
      await checkAdminPermissions();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const params = getUsersSchema.parse(Object.fromEntries(searchParams));

    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const search = params.search;

    // Get users with pagination and filtering using our data access layer
    const result = await getUsers({
      page,
      limit,
      search,
    });

    return NextResponse.json({
      success: true,
      data: {
        users: result.users,
        pagination: result.pagination,
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
    // Get auth session and verify admin permissions
    const auth = await getAuth();
    
    // Check if user is authenticated
    if (!auth?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin permissions
    try {
      await checkAdminPermissions();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const userData = createUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await getUserByClerkId(userData.clerk_id);

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