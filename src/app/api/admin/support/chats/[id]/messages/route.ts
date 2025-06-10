import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Message validation schema
const messageSchema = z.object({
  message: z.string().min(1, 'Message content is required'),
});

// POST /api/admin/support/chats/:id/messages - Send a message in a chat session
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatId = params.id;
    const body = await request.json();
    
    // Validate the request body
    try {
      messageSchema.parse(body);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Check if the chat session exists
    const chatSession = await prisma.chatSession.findUnique({
      where: { id: chatId }
    });

    if (!chatSession) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    // Create the message
    const message = await prisma.chatMessage.create({
      data: {
        message: body.message,
        is_admin: true,
        user_id: userId,
        session_id: chatId
      }
    });

    // Update the chat session's updated_at timestamp and status if needed
    await prisma.chatSession.update({
      where: { id: chatId },
      data: { 
        updated_at: new Date(),
        // If the chat was closed, reopen it when an admin sends a message
        status: chatSession.status === 'CLOSED' ? 'ACTIVE' : chatSession.status
      }
    });

    // Log the admin activity
    await prisma.adminActivity.create({
      data: {
        admin_id: userId,
        action_type: 'USER_MANAGEMENT',
        details: JSON.stringify({
          chatId,
          messageId: message.id
        })
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET /api/admin/support/chats/:id/messages - Get all messages in a chat session
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatId = params.id;
    
    // Parse query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Count total messages in the chat session
    const totalMessages = await prisma.chatMessage.count({
      where: { session_id: chatId }
    });
    
    // Fetch messages with pagination
    const messages = await prisma.chatMessage.findMany({
      where: { session_id: chatId },
      orderBy: { created_at: 'asc' },
      skip: (page - 1) * limit,
      take: limit
    });

    return NextResponse.json({
      messages,
      pagination: {
        total: totalMessages,
        page,
        limit,
        pages: Math.ceil(totalMessages / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}