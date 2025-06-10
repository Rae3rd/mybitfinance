import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/support/chats/:id - Get a specific chat session with all messages
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatId = params.id;
    
    // Fetch the chat session with all messages
    const chat = await prisma.chatSession.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: {
            created_at: 'asc'
          }
        }
      }
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    // Add user data to the chat session
    const chatWithUserData = {
      ...chat,
      // Add placeholder user data
      userData: {
        name: 'User Name', // Placeholder - replace with actual user data
        email: 'user@example.com' // Placeholder - replace with actual user data
      }
    };

    return NextResponse.json(chatWithUserData);
  } catch (error) {
    console.error('Error fetching chat session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat session' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/support/chats/:id - Update chat session status or assignment
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatId = params.id;
    const body = await request.json();
    
    // Validate the request body
    if (!body.status && !body.admin_id) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Update the chat session
    const updateData: any = { updated_at: new Date() };
    
    if (body.status) {
      updateData.status = body.status.toUpperCase();
    }
    
    if (body.admin_id) {
      updateData.admin_id = body.admin_id;
    }
    
    const updatedChat = await prisma.chatSession.update({
      where: { id: chatId },
      data: updateData
    });

    // Log the admin activity
    await prisma.adminActivity.create({
      data: {
        admin_id: userId,
        action_type: 'USER_MANAGEMENT',
        details: JSON.stringify({
          chatId,
          previousStatus: updatedChat.status,
          newStatus: body.status ? body.status.toUpperCase() : updatedChat.status,
          adminId: body.admin_id || updatedChat.admin_id
        })
      }
    });

    // Add user data to the response
    const chatWithUserData = {
      ...updatedChat,
      // Add placeholder user data
      userData: {
        name: 'User Name', // Placeholder - replace with actual user data
        email: 'user@example.com' // Placeholder - replace with actual user data
      }
    };

    return NextResponse.json(chatWithUserData);
  } catch (error) {
    console.error('Error updating chat session:', error);
    return NextResponse.json(
      { error: 'Failed to update chat session' },
      { status: 500 }
    );
  }
}