import { prisma } from '@/lib/prisma';

/**
 * Server-side data access layer for dashboard metrics
 * IMPORTANT: This file should only be imported in server components or API routes
 */

/**
 * Get dashboard metrics for admin panel
 */
export async function getDashboardMetrics() {
  // Get current date and date 30 days ago for period comparisons
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(now.getDate() - 60);
  
  // Run all queries in parallel for better performance
  const [
    totalUsers,
    newUsers,
    previousPeriodUsers,
    totalTransactions,
    transactionVolume,
    previousTransactionVolume,
    pendingTransactions,
    openSupportTickets,
    recentActivities,
    usersByStatus,
    transactionsByStatus,
    transactionsByType,
  ] = await Promise.all([
    // Total users
    prisma.user.count(),
    
    // New users in last 30 days
    prisma.user.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    
    // Users in previous 30 days (for growth calculation)
    prisma.user.count({
      where: {
        created_at: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    }),
    
    // Total transactions
    prisma.transaction.count(),
    
    // Transaction volume in last 30 days
    prisma.transaction.aggregate({
      where: {
        created_at: {
          gte: thirtyDaysAgo,
        },
        status: 'completed',
      },
      _sum: {
        amount: true,
      },
    }),
    
    // Transaction volume in previous 30 days (for growth calculation)
    prisma.transaction.aggregate({
      where: {
        created_at: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
        status: 'completed',
      },
      _sum: {
        amount: true,
      },
    }),
    
    // Pending transactions
    prisma.transaction.count({
      where: {
        status: 'pending',
      },
    }),
    
    // Open support tickets
    prisma.supportTicket.count({
      where: {
        status: 'open',
      },
    }),
    
    // Recent activities
    prisma.activity.findMany({
      take: 10,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: true,
        asset: true,
      },
    }),
    
    // Users by status
    prisma.user.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    }),
    
    // Transactions by status
    prisma.transaction.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
    }),
    
    // Transactions by type
    prisma.transaction.groupBy({
      by: ['type'],
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
    }),
  ]);
  
  // Calculate growth rates
  const userGrowthRate = previousPeriodUsers > 0 
    ? ((newUsers - previousPeriodUsers) / previousPeriodUsers) * 100 
    : 0;
    
  const currentVolume = transactionVolume._sum.amount || 0;
  const previousVolume = previousTransactionVolume._sum.amount || 0;
  const transactionVolumeGrowth = previousVolume > 0 
    ? ((currentVolume - previousVolume) / previousVolume) * 100 
    : 0;
  
  // Format user status data
  const userStatusData = usersByStatus.reduce((acc, item) => {
    acc[item.status] = item._count.id;
    return acc;
  }, {} as Record<string, number>);
  
  // Format transaction status data
  const transactionStatusData = transactionsByStatus.reduce((acc, item) => {
    acc[item.status] = {
      count: item._count.id,
      amount: item._sum.amount || 0,
    };
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);
  
  // Format transaction type data
  const transactionTypeData = transactionsByType.reduce((acc, item) => {
    acc[item.type] = {
      count: item._count.id,
      amount: item._sum.amount || 0,
    };
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);
  
  return {
    users: {
      total: totalUsers,
      new: newUsers,
      growthRate: userGrowthRate,
      byStatus: userStatusData,
    },
    transactions: {
      total: totalTransactions,
      pending: pendingTransactions,
      volume: currentVolume,
      volumeGrowth: transactionVolumeGrowth,
      byStatus: transactionStatusData,
      byType: transactionTypeData,
    },
    supportTickets: {
      open: openSupportTickets,
    },
    recentActivities,
  };
}