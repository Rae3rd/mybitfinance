'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

type Activity = {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  amount: string;
  quantity: string;
  time: string;
};

type ErrorType = {
  message: string;
  code?: number;
};

export default function RecentActivity() {
  const { isLoaded, isSignedIn } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchActivities = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/activities', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
          { cause: response.status }
        );
      }

      const data = await response.json();
      
      // Validate response data
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      setActivities(data);
      setError(null);
      setRetryCount(0); // Reset retry count on successful fetch
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError({
        message: error instanceof Error ? error.message : 'Failed to fetch activities',
        code: error instanceof Error && error.cause ? Number(error.cause) : undefined
      });
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    fetchActivities();

    // Set up auto-refresh every 30 seconds if the tab is visible
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchActivities();
      }
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchActivities]);

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchActivities();
    }
  };

  if (!isLoaded) {
    return <div className="animate-pulse">Loading authentication...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view your recent activities.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <button
          onClick={fetchActivities}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse text-center py-4">Loading activities...</div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-600 mb-2">{error.message}</p>
          {retryCount < 3 && (
            <button
              onClick={handleRetry}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Retry
            </button>
          )}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No recent activities to display
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                >
                  {activity.type === 'buy' ? '↑' : '↓'}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type === 'buy' ? 'Bought' : 'Sold'} {activity.quantity}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{activity.amount}</p>
                <p className="text-xs text-gray-500">{activity.asset}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}