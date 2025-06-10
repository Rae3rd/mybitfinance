import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Helper function to check admin permissions
async function checkAdminPermissions() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Check if user has admin role
  const userRole = (sessionClaims?.metadata as Record<string, unknown>)?.role as string | undefined;
  if (!['admin', 'super_admin'].includes(userRole || '')) {
    throw new Error('Insufficient permissions');
  }

  return userId;
}

// Calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export async function GET(request: NextRequest) {
  try {
    await checkAdminPermissions();

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get active users (users who logged in within last 24 hours)
    const activeUsers = await prisma.user.count({
      where: {
        updated_at: {
          gte: yesterday,
        },
      },
    });

    // Get active users from previous day for comparison
    const previousActiveUsers = await prisma.user.count({
      where: {
        updated_at: {
          gte: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000),
          lt: yesterday,
        },
      },
    });

    // Get new registrations in last 24 hours
    const newRegistrations = await prisma.user.count({
      where: {
        created_at: {
          gte: yesterday,
        },
      },
    });

    // Get new registrations from previous day
    const previousNewRegistrations = await prisma.user.count({
      where: {
        created_at: {
          gte: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000),
          lt: yesterday,
        },
      },
    });

    // Get pending transactions
    const pendingTransactions = await prisma.transaction.count({
      where: {
        status: 'pending',
      },
    });

    // Get pending transactions from yesterday
    const previousPendingTransactions = await prisma.transaction.count({
      where: {
        status: 'pending',
        created_at: {
          lt: yesterday,
        },
      },
    });

    // Get open support tickets
    const openTickets = await prisma.supportTicket.count({
      where: {
        status: {
          in: ['OPEN', 'PENDING'],
        },
      },
    });

    // Get open tickets from yesterday
    const previousOpenTickets = await prisma.supportTicket.count({
      where: {
        status: {
          in: ['OPEN', 'PENDING'],
        },
        created_at: {
          lt: yesterday,
        },
      },
    });

    // Get today's revenue and volume
    const todayTransactions = await prisma.transaction.aggregate({
      where: {
        status: 'approved',
        processed_at: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        },
      },
      _sum: {
        amount: true,
        fee: true,
      },
    });

    // Get yesterday's revenue for comparison
    const yesterdayTransactions = await prisma.transaction.aggregate({
      where: {
        status: 'approved',
        processed_at: {
          gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        },
      },
      _sum: {
        amount: true,
        fee: true,
      },
    });

    const todayRevenue = todayTransactions._sum.fee || 0;
    const yesterdayRevenue = yesterdayTransactions._sum.fee || 0;
    const todayVolume = todayTransactions._sum.amount || 0;

    // System health checks
    const systemHealth = {
      api: 'healthy' as const,
      database: 'healthy' as const,
      jobs: 'healthy' as const,
    };

    // Check database health
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      systemHealth.database = 'error' as 'healthy'; // Type assertion to satisfy TypeScript
    }

    // Get critical alerts
    const criticalAlerts: string[] = [];
    
    // Check for high pending transaction volume
    if (pendingTransactions > 50) {
      criticalAlerts.push(`High pending transaction volume: ${pendingTransactions} transactions`);
    }

    // Check for old pending transactions
    const oldPendingTransactions = await prisma.transaction.count({
      where: {
        status: 'pending',
        created_at: {
          lt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
      },
    });

    if (oldPendingTransactions > 0) {
      criticalAlerts.push(`${oldPendingTransactions} transactions pending for over 2 hours`);
    }

    // Check for high support ticket volume
    if (openTickets > 20) {
      criticalAlerts.push(`High support ticket volume: ${openTickets} open tickets`);
    }

    const metrics = {
      activeUsers,
      activeUsersChange: calculatePercentageChange(activeUsers, previousActiveUsers),
      newRegistrations,
      newRegistrationsChange: calculatePercentageChange(newRegistrations, previousNewRegistrations),
      pendingTransactions,
      pendingTransactionsChange: calculatePercentageChange(pendingTransactions, previousPendingTransactions),
      openTickets,
      openTicketsChange: calculatePercentageChange(openTickets, previousOpenTickets),
      systemHealth,
      revenue: {
        today: todayRevenue,
        todayChange: calculatePercentageChange(todayRevenue, yesterdayRevenue),
        volume: todayVolume,
      },
      criticalAlerts,
    };

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}