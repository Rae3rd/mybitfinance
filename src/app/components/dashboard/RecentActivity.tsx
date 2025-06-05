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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-navy-800 rounded-xl shadow-lg border border-navy-700 p-6 backdrop-blur-sm bg-opacity-80 hover:shadow-emerald-900/20 hover:shadow-lg transition-all duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full h-full"
      >
        <motion.div 
          className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            className="text-xl font-semibold text-white flex items-center"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ClockIcon className="w-5 h-5 mr-2 text-emerald-500" />
            Recent Activity
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchActivities}
            disabled={loading}
            className="text-sm text-emerald-500 hover:text-emerald-400 disabled:opacity-50 flex items-center space-x-1 bg-navy-700/50 px-3 py-1.5 rounded-lg"
          >
            <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-10 h-10 text-emerald-500"
              >
                <RefreshIcon className="w-10 h-10" />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-gray-400"
              >
                Loading activities...
              </motion.p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 px-4"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="mx-auto w-12 h-12 text-red-500 mb-3"
              >
                <ExclamationCircleIcon className="w-12 h-12" />
              </motion.div>
              <p className="text-red-400 mb-3">{error.message}</p>
              {retryCount < 3 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetry}
                  className="text-sm bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors"
                >
                  Retry
                </motion.button>
              )}
            </motion.div>
          ) : activities.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 px-4 border border-dashed border-navy-600 rounded-lg"
            >
              <ClockIcon className="w-10 h-10 text-navy-600 mx-auto mb-2" />
              <p className="text-gray-400">
                No recent activities to display
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="activities"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(16, 24, 39, 0.5)' }}
                  className="flex items-center justify-between p-3 rounded-lg border border-navy-700/50 hover:border-navy-600 transition-all duration-200 relative overflow-hidden"
                >
                  {/* Background gradient effect */}
                  <div className={`absolute inset-0 opacity-10 ${activity.type === 'buy' ? 'bg-gradient-to-r from-emerald-900/20 to-transparent' : 'bg-gradient-to-r from-red-900/20 to-transparent'}`}></div>
                  <div className="flex items-center space-x-3 z-10">
                    <motion.div
                      animate={activity.type === 'buy' ? 
                        { y: [0, -2, 0] } : 
                        { y: [0, 2, 0] }
                      }
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'buy' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}
                    >
                      {activity.type === 'buy' ? 
                        <ArrowCircleUpIcon className="w-5 h-5" /> : 
                        <ArrowCircleDownIcon className="w-5 h-5" />
                      }
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {activity.type === 'buy' ? 'Bought' : 'Sold'} {activity.quantity}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1 inline" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right z-10">
                    <p className={`text-sm font-medium ${activity.type === 'buy' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {activity.amount}
                    </p>
                    <p className="text-xs text-gray-400">{activity.asset}</p>
                  </div>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-3 text-center"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  View All Activity History
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}