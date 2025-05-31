import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter instance
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
});

// Define the request schema
const portfolioItemSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['STOCK', 'CRYPTO'], { required_error: 'Type must be either STOCK or CRYPTO' }),
  quantity: z.number().positive('Quantity must be positive'),
  buyPrice: z.number().positive('Buy price must be positive'),
  buyDate: z.string().datetime({ message: 'Invalid date format' }),
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success, reset } = await ratelimit.limit(ip);
    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': reset.toString() },
      });
    }

    // Auth check
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const result = portfolioItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { symbol, name, type, quantity, buyPrice, buyDate } = result.data;

    // Database operations with better error handling
    try {
      // First, find or create the asset
      const asset = await prisma.asset.upsert({
        where: { symbol },
        update: {},
        create: { symbol, name, type },
      });

      // Then create the portfolio item
      const portfolioItem = await prisma.portfolioItem.create({
        data: {
          quantity,
          buy_price: buyPrice,
          buy_date: new Date(buyDate),
          user: { connect: { clerk_id: userId } },
          asset: { connect: { id: asset.id } },
        },
      });

      // Create an activity record
      await prisma.activity.create({
        data: {
          type: 'BUY',
          amount: buyPrice,
          quantity,
          user: { connect: { clerk_id: userId } },
          asset: { connect: { id: asset.id } },
        },
      });

      return NextResponse.json(portfolioItem);
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}