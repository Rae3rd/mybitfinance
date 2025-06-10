import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import { Prisma } from '@prisma/client';

type FormattedActivity = {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  amount: string;
  quantity: string;
  time: string;
};

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user in our database by Clerk ID
    const dbUser = await prisma.user.findUnique({
      where: { clerk_id: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's activities with asset information
    const activities = await prisma.activity.findMany({
      where: { user_id: dbUser.id },
      orderBy: { created_at: 'desc' },
      take: 10,
      include: { asset: true },
    });

    // Format the activities for the frontend
    const formattedActivities = activities.map((activity) => {
      try {
        // Convert activity type to lowercase for frontend
        let displayType: 'buy' | 'sell' = 'buy';
        
        switch(activity.type) {
          case 'BUY':
            displayType = 'buy';
            break;
          case 'SELL':
            displayType = 'sell';
            break;
          case 'DEPOSIT':
          case 'INTEREST':
          case 'DIVIDEND':
            displayType = 'buy'; // Treat as incoming funds
            break;
          case 'WITHDRAW':
            displayType = 'sell'; // Treat as outgoing funds
            break;
          default:
            displayType = 'buy'; // Default fallback
        }
        
        return {
          id: activity.id,
          type: displayType,
          asset: activity.asset.symbol,
          amount: activity.amount
            ? `$${activity.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : '$0.00',
          quantity: activity.quantity
            ? activity.asset.type === 'STOCK'
              ? `${activity.quantity} shares`
              : `${activity.quantity} ${activity.asset.symbol}`
            : '0',
          time: formatDistanceToNow(activity.created_at, { addSuffix: true }),
        };
      } catch (formatError) {
        console.error('Error formatting activity:', formatError, activity);
        return null;
      }
    }).filter(Boolean) as FormattedActivity[];

    return NextResponse.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    
    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: 'Database error', code: error.code },
        { status: 500 }
      );
    }

    // Handle other specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}