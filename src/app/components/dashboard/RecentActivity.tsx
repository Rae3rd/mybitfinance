'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon as RefreshIcon, ClockIcon, ExclamationCircleIcon, ArrowUpCircleIcon as ArrowCircleUpIcon, ArrowDownCircleIcon as ArrowCircleDownIcon } from '@heroicons/react/24/outline';

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
  const [retryDelay, setRetryDelay] = useState(2000); // Start with 2 seconds

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
      setRetryDelay(2000); // Reset retry delay on successful fetch
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError({
        message: error instanceof Error ? error.message : 'Failed to fetch activities',
        code: error instanceof Error && error.cause ? Number(error.cause) : undefined
      });
      
      // If it's a database connection error (503), schedule automatic retry
      if (error instanceof Error && error.cause === 503) {
        handleAutomaticRetry();
      }
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  // Automatic retry with exponential backoff
  const handleAutomaticRetry = useCallback(() => {
    if (retryCount < 5) { // Maximum 5 automatic retries
      const nextRetryDelay = Math.min(retryDelay * 1.5, 30000); // Exponential backoff, max 30 seconds
      
      console.log(`Scheduling automatic retry ${retryCount + 1} in ${retryDelay / 1000}s`);
      
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setRetryDelay(nextRetryDelay);
        fetchActivities();
      }, retryDelay);
    }
  }, [retryCount, retryDelay, fetchActivities]);

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

  // Manual retry button handler
  const handleManualRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchActivities();
  };

  if (!isLoaded) {
    return <div className="animate-pulse">Loading authentication...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view your recent activities.</div>;
  }

  return (
    <div className="bg-navy-800 rounded-xl shadow-lg border border-navy-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-emerald-500" />
          Recent Activity
        </h2>
        <button
          onClick={handleManualRetry}
          disabled={loading}
          className="text-emerald-500 hover:text-emerald-400 disabled:text-gray-500 disabled:cursor-not-allowed"
          title="Refresh activities"
        >
          <RefreshIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error ? (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">
                {error.code ? `Error ${error.code}: ` : ''}{error.message}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {error.code === 503 ? 
                  `Automatic retry ${retryCount}/5 scheduled...` : 
                  'Please try again later or contact support if the problem persists.'}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {loading && activities.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-lg bg-navy-700/50">
              <div className="flex items-center">
                <div className="rounded-full bg-navy-600 h-10 w-10 mr-3"></div>
                <div>
                  <div className="h-4 bg-navy-600 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-navy-600 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-navy-600 rounded w-20"></div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-2">
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-700/50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`rounded-full p-2 ${activity.type === 'buy' ? 'bg-emerald-900/30 text-emerald-500' : 'bg-red-900/30 text-red-500'} mr-3`}>
                    {activity.type === 'buy' ? (
                      <ArrowCircleUpIcon className="h-5 w-5" />
                    ) : (
                      <ArrowCircleDownIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {activity.type === 'buy' ? 'Bought' : 'Sold'} {activity.asset}
                    </p>
                    <p className="text-sm text-gray-400">{activity.quantity}</p>
                  </div>
                </div>
                <div>
                  <p className={`font-medium ${activity.type === 'buy' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {activity.type === 'buy' ? '+' : '-'}{activity.amount}
                  </p>
                  <p className="text-xs text-gray-400 text-right">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-navy-700 rounded-full p-3 inline-block mb-4">
            <ClockIcon className="h-6 w-6 text-emerald-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Activity Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Your recent transactions will appear here. Start trading to see your activity.
          </p>
        </div>
      )}
    </div>
  );
}