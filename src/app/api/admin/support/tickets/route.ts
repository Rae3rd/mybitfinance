import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ticketUpdateSchema, ticketReplySchema } from '@/lib/validation/adminValidation';

// GET /api/admin/support/tickets - Get all support tickets with filtering
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

    // Count total tickets matching the filter
    const totalTickets = await prisma.supportTicket.count({ where });
    
    // Fetch tickets with pagination, sorting, and include user data
    const tickets = await prisma.supportTicket.findMany({
      where,
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
          },
          take: 1 // Just include the latest reply for preview
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Fetch user data from Clerk for each ticket
    // In a real implementation, you might want to batch these requests
    // or use a more efficient approach to get user data
    const ticketsWithUserData = await Promise.all(tickets.map(async (ticket: any) => {
      // Here you would typically fetch user data from Clerk using the clerk_id
      // For now, we'll just return the ticket as is
      return {
        ...ticket,
        user: {
          ...ticket.user,
          // Add additional user data here if needed
          name: 'User Name', // Placeholder - replace with actual user data
          email: 'user@example.com' // Placeholder - replace with actual user data
        }
      };
    }));

    return NextResponse.json({
      tickets: ticketsWithUserData,
      pagination: {
        total: totalTickets,
        page,
        limit,
        pages: Math.ceil(totalTickets / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
}

// GET /api/admin/support/tickets/:id - Get a specific ticket with full details
export async function getTicketById(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
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

    // Add user data to the ticket
    const ticketWithUserData = {
      ...ticket,
      user: {
        ...ticket.user,
        name: 'User Name', // Placeholder - replace with actual user data
        email: 'user@example.com' // Placeholder - replace with actual user data
      }
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
    const { userId } = await auth();
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

// POST /api/admin/support/tickets/:id/reply - Reply to a ticket
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticketId = params.id;
    const body = await request.json();
    
    // Validate the request body
    try {
      ticketReplySchema.parse(body);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Create the reply
    const reply = await prisma.ticketReply.create({
      data: {
        message: body.message,
        is_admin: true,
        admin_id: userId,
        ticket: {
          connect: { id: ticketId }
        }
      }
    });

    // Update the ticket's updated_at timestamp
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { updated_at: new Date() }
    });

    // Log the admin activity
    await prisma.adminActivity.create({
      data: {
        admin_id: userId,
        action_type: 'USER_MANAGEMENT',
        description: `Replied to support ticket #${ticketId}`,
        metadata: JSON.stringify({
          ticketId,
          replyId: reply.id
        })
      }
    });

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error('Error replying to support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to reply to support ticket' },
      { status: 500 }
    );
  }
}