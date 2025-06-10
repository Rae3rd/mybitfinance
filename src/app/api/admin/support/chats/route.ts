import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/support/chats - Get all chat sessions with filtering
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');
    const userIdParam = searchParams.get('userId');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter conditions
    const where: any = {};
    
    if (status) {
      where.status = status.toUpperCase();
    }
    
    if (assignedTo) {
      where.assigned_to = assignedTo;
    }
    
    if (userIdParam) {
      where.user_id = userIdParam;
    }

    // Count total chat sessions matching the filter
    const totalChats = await prisma.chatSession.count({ where });
    
    // Fetch chat sessions with pagination, sorting, and include user data
    const chats = await prisma.chatSession.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            clerk_id: true,
          }
        },
        messages: {
          orderBy: {
            created_at: 'desc'
          },
          take: 1 // Just include the latest message for preview
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Fetch user data from Clerk for each chat session
    const chatsWithUserData = await Promise.all(chats.map(async (chat) => {
      // Here you would typically fetch user data from Clerk using the clerk_id
      // For now, we'll just return the chat as is
      return {
        ...chat,
        user: {
          ...chat.user,
          // Add additional user data here if needed
          name: 'User Name', // Placeholder - replace with actual user data
          email: 'user@example.com' // Placeholder - replace with actual user data
        }
      };
    }));

    return NextResponse.json({
      chats: chatsWithUserData,
      pagination: {
        total: totalChats,
        page,
        limit,
        pages: Math.ceil(totalChats / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}