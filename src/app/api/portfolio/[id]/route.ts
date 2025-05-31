import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: {
        id: params.id,
        user_id: userId,
      },
      include: {
        asset: true,
      },
    });

    if (!portfolioItem) {
      return new NextResponse('Portfolio item not found', { status: 404 });
    }

    return NextResponse.json(portfolioItem);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // First check if the portfolio item exists and belongs to the user
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: {
        id: params.id,
        user_id: userId,
      },
    });

    if (!portfolioItem) {
      return new NextResponse('Portfolio item not found', { status: 404 });
    }

    // Delete the portfolio item
    await prisma.portfolioItem.delete({
      where: {
        id: params.id,
      },
    });

    // Create an activity record for the deletion
    await prisma.activity.create({
      data: {
        type: 'SELL',
        user_id: userId,
        asset_id: portfolioItem.asset_id,
        quantity: portfolioItem.quantity,
        amount: portfolioItem.quantity * portfolioItem.buy_price,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}