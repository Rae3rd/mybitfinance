import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { withRetry } from '@/lib/db-connect';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use withRetry for database operations
    const activities = await withRetry(() => prisma.activity.findMany({
      where: {
        user_id: userId,
      },
      include: {
        asset: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10,
    }));

    // Format activities for frontend
    const formattedActivities = activities.map((activity) => {
      return {
        id: activity.id,
        type: activity.type,
        asset: activity.asset?.symbol || 'Unknown',
        amount: activity.amount ? `$${activity.amount.toFixed(2)}` : '$0.00',
        quantity: `${activity.quantity || 0} ${activity.asset?.symbol || 'Unknown'}`,
        time: new Date(activity.created_at).toLocaleString(),
      };
    });

    return NextResponse.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    
    // Handle different types of Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P1001') {
        return NextResponse.json(
          { error: 'Database connection error. Please try again later.' },
          { status: 503 }
        );
      }
      if (error.code === 'P2001') {
        return NextResponse.json(
          { error: 'Record not found.' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}