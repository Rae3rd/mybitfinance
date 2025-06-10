import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ticketReplySchema } from '@/lib/validation/adminValidation';

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

    // Update the ticket's updated_at timestamp and status if provided
    const updateData: any = { updated_at: new Date() };
    if (body.status) {
      updateData.status = body.status.toUpperCase();
    }
    
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData
    });

    // Log the admin activity
    await prisma.adminActivity.create({
      data: {
        admin_id: userId,
        action_type: 'USER_MANAGEMENT',
        description: `Replied to support ticket #${ticketId}`,
        metadata: JSON.stringify({
          ticketId,
          replyId: reply.id,
          statusUpdate: body.status ? body.status.toUpperCase() : null
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