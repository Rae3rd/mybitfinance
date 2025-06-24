'use client';

import { useState } from 'react';
import { useDashboardMetrics } from '@/lib/hooks/useAdminApi';
import { useIsAdmin } from '@/lib/auth/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Button } from '@/app/components/ui/button';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * AdminDashboardMetrics Component
 * 
 * This component demonstrates the proper way to use client-side authentication
 * and API data fetching with our new structure.
 */
export default function AdminDashboardMetrics() {
  // Use our client-side auth hook to check if the user is an admin
  const { isAdmin, isLoading: isAuthLoading } = useIsAdmin();
  
  // Use our client-side API hook to fetch dashboard metrics
  const { 
    data: metrics, 
    isLoading: isMetricsLoading, 
    error: metricsError,
    refetch: refetchMetrics
  } = useDashboardMetrics();
  
  // Handle refresh button click
  const handleRefresh = () => {
    refetchMetrics();
  };
  
  // If auth is still loading, show a loading state
  if (isAuthLoading) {
    return <MetricsLoadingState />;
  }
  
  // If user is not an admin, show an unauthorized message
  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Unauthorized</AlertTitle>
        <AlertDescription>
          You do not have permission to view this dashboard.
        </AlertDescription>
      </Alert>
    );
  }
  
  // If there's an error fetching metrics, show an error message
  if (metricsError) {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dashboard metrics. Please try again.
          <Button variant="outline" size="sm" className="ml-2" onClick={handleRefresh}>
            <ArrowPathIcon className="h-4 w-4 mr-1" /> Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  // If metrics are still loading, show a loading state
  if (isMetricsLoading) {
    return <MetricsLoadingState />;
  }
  
  // Render the dashboard metrics
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Users Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.users?.total || 0}</div>
          <p className="text-xs text-muted-foreground">
            {metrics?.users?.growthRate > 0 ? '+' : ''}
            {metrics?.users?.growthRate?.toFixed(1) || 0}% from last month
          </p>
        </CardContent>
      </Card>
      
      {/* Revenue Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${metrics?.transactions?.volume?.toFixed(2) || '0.00'}
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics?.transactions?.volumeGrowth > 0 ? '+' : ''}
            {metrics?.transactions?.volumeGrowth?.toFixed(1) || 0}% from yesterday
          </p>
        </CardContent>
      </Card>
      
      {/* Pending Transactions Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.transactions?.pending || 0}</div>
          <p className="text-xs text-muted-foreground">
            {metrics?.transactions?.pendingTransactionsChange > 0 ? '+' : ''}
            {metrics?.transactions?.pendingTransactionsChange?.toFixed(1) || 0}% from yesterday
          </p>
        </CardContent>
      </Card>
      
      {/* Support Tickets Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Open Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.supportTickets?.open || 0}</div>
        </CardContent>
      </Card>
      
      <CardFooter className="col-span-full flex justify-end">
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <ArrowPathIcon className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </CardFooter>
    </div>
  );
}

// Loading state component
function MetricsLoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-[120px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px] mb-2" />
            <Skeleton className="h-3 w-[100px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}