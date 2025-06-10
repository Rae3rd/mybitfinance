import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ticketUpdateSchema } from '@/lib/validation/adminValidation';

// GET /api/admin/support/tickets/:id - Get a specific ticket with full details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticketId = params.id;
    
    // Fetch the ticket with all replies
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            clerk_id: true,
          }
        },
        replies: {
          orderBy: {
            created_at: 'asc'
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    
    // Add user data to the response
    const ticketWithUserData = {
      ...ticket,
      user: {
        ...ticket.user,
        name: 'User Name', // Placeholder - replace with actual user data
        email: 'user@example.com' // Placeholder - replace with actual user data
      },
      replies: ticket.replies.map((reply: any) => ({
        ...reply,
        admin_name: reply.is_admin ? 'Admin Name' : null // Placeholder - replace with actual admin data
      }))
    };

    return NextResponse.json(ticketWithUserData);
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support ticket' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/support/tickets/:id - Update ticket status or assignment
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticketId = params.id;
    const body = await request.json();
    
    // Validate the request body
    try {
      ticketUpdateSchema.parse(body);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Update the ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: body.status.toUpperCase(),
        assigned_to: body.assigned_to,
        updated_at: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            clerk_id: true,
          }
        }
      }
    });

    // Log the admin activity
    await prisma.adminActivity.create({
      data: {
        admin_id: userId,
        action_type: 'USER_MANAGEMENT',
        description: `Updated support ticket #${ticketId} status to ${body.status}`,
        metadata: JSON.stringify({
          ticketId,
          previousStatus: updatedTicket.status,
          newStatus: body.status.toUpperCase(),
          assignedTo: body.assigned_to
        })
      }
    });

    // Add user data to the response
    const ticketWithUserData = {
      ...updatedTicket,
      user: {
        ...updatedTicket.user,
        name: 'User Name', // Placeholder - replace with actual user data
        email: 'user@example.com' // Placeholder - replace with actual user data
      }
    };

    return NextResponse.json(ticketWithUserData);
  } catch (error) {
    console.error('Error updating support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update support ticket' },
      { status: 500 }
    );
  }
}