'use client';

import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import PortfolioOverview from '@/app/components/dashboard/PortfolioOverview';
import Watchlist from '@/app/components/dashboard/Watchlist';
import MarketOverview from '@/app/components/dashboard/MarketOverview';
import RecentActivity from '@/app/components/dashboard/RecentActivity';
import QuickActions from '@/app/components/dashboard/QuickActions';
import NewsUpdates from '@/app/components/dashboard/NewsUpdates';
import CollapsibleCard from '@/app/components/CollapsibleCard';
import ProgressIndicator from '@/app/components/ProgressIndicator';

export default function Dashboard() {
  const { user } = useUser();
  
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Use intersection observer for scroll animations
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-navy-600 to-emerald-500 bg-clip-text text-transparent animate-text-shimmer">
          Welcome back, {user?.firstName || 'Investor'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your investments today.
        </p>
      </motion.div>

      {/* Main Dashboard Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        ref={ref}
      >
        {/* Left Column - Main Content */}
        <motion.div 
          className="lg:col-span-2 space-y-8"
          variants={itemVariants}
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <PortfolioOverview />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <CollapsibleCard title="Live Market Data" initialOpen liveData="Updated 5s ago">
                <p className="text-gray-300">Real-time market data and insights at your fingertips.</p>
                <div className="mt-4">
                  <ProgressIndicator progress={75} label="Market Sentiment" />
                </div>
              </CollapsibleCard>
            </motion.div>
            
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <CollapsibleCard title="Your Investment Progress" liveData="+$1,234.56">
                <p className="text-gray-300">Track your investment growth and performance metrics.</p>
                <div className="mt-4">
                  <ProgressIndicator progress={90} label="Portfolio Growth" />
                </div>
              </CollapsibleCard>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <MarketOverview />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <RecentActivity />
          </motion.div>
        </motion.div>

        {/* Right Column - Sidebar */}
        <motion.div 
          className="space-y-8"
          variants={itemVariants}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <QuickActions />
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Watchlist />
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <NewsUpdates />
          </motion.div>
          
          {/* New Feature Card */}
          <motion.div 
            className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-xl shadow-lg border border-navy-700 p-6 text-white"
            whileHover={{ scale: 1.05 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300,
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
            animate={{ 
              boxShadow: ['0 4px 12px rgba(79, 88, 255, 0.25)', '0 8px 24px rgba(16, 185, 129, 0.35)', '0 4px 12px rgba(79, 88, 255, 0.25)'] 
            }}
          >
            <h3 className="text-lg font-semibold mb-2">New Feature Alert</h3>
            <p className="text-gray-300 mb-4">Try our AI-powered investment recommendations for personalized insights.</p>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors">
              Explore Now
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}