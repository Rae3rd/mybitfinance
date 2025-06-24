import { NextRequest, NextResponse } from 'next/server';
import { getAuth, checkAdminPermissions } from '@/lib/auth/server';
import { getDashboardMetrics } from '@/lib/data/dashboardMetrics';

// Calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export async function GET(request: NextRequest) {
  try {
    // Get auth session
    const auth = await getAuth();
    
    // Check if user is authenticated
    if (!auth?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin permissions
    try {
      await checkAdminPermissions();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Get dashboard metrics using the data access layer
    const metrics = await getDashboardMetrics();
    
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}