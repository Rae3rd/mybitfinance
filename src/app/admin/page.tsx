'use client';

import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChatBubbleLeftRightIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AdminDashboard() {
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

  // Mock data for dashboard
  const dashboardData = {
    activeUsers: 1243,
    activeUsersChange: 12.5,
    newRegistrations: 87,
    newRegistrationsChange: 23.4,
    pendingTransactions: 34,
    pendingTransactionsChange: -5.2,
    openTickets: 12,
    openTicketsChange: 8.7,
    systemHealth: {
      api: 'healthy',
      database: 'healthy',
      jobs: 'warning'
    },
    revenue: {
      today: 12450.75,
      todayChange: 15.3,
      volume: 1245000.50
    },
    criticalAlerts: [
      'Payment gateway latency detected (3.2s response time)',
      'Unusual withdrawal pattern detected for user ID: 8721',
      'System update scheduled for 02:00 UTC'
    ]
  };

  // Metric card component
  const MetricCard = ({ title, value, change, icon: Icon, link }: { 
    title: string, 
    value: string | number, 
    change: number, 
    icon: any,
    link: string 
  }) => (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link href={link} className="block p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <>
                  <ArrowUpIcon className="w-4 h-4 text-emerald-500 mr-1" />
                  <span className="text-sm font-medium text-emerald-500">{change}%</span>
                </>
              ) : (
                <>
                  <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm font-medium text-red-500">{Math.abs(change)}%</span>
                </>
              )}
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Icon className="w-8 h-8 text-navy-600" />
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <>
      {/* Welcome Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-navy-600 to-emerald-500 bg-clip-text text-transparent animate-text-shimmer">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.firstName || 'Administrator'}! Here's the platform overview.
        </p>
      </motion.div>

      {/* Real-time alerts banner */}
      {dashboardData.criticalAlerts.length > 0 && (
        <motion.div 
          className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex">
            <ExclamationCircleIcon className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Attention Required</h3>
              <div className="mt-1 text-sm text-amber-700 space-y-1">
                {dashboardData.criticalAlerts.map((alert, index) => (
                  <p key={index}>{alert}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        ref={ref}
      >
        <MetricCard 
          title="Active Users" 
          value={dashboardData.activeUsers.toLocaleString()} 
          change={dashboardData.activeUsersChange} 
          icon={UsersIcon}
          link="/admin/users"
        />
        <MetricCard 
          title="New Registrations (24h)" 
          value={dashboardData.newRegistrations} 
          change={dashboardData.newRegistrationsChange} 
          icon={UsersIcon}
          link="/admin/users?filter=new"
        />
        <MetricCard 
          title="Pending Transactions" 
          value={dashboardData.pendingTransactions} 
          change={dashboardData.pendingTransactionsChange} 
          icon={CurrencyDollarIcon}
          link="/admin/transactions?status=pending"
        />
        <MetricCard 
          title="Open Support Tickets" 
          value={dashboardData.openTickets} 
          change={dashboardData.openTicketsChange} 
          icon={ChatBubbleLeftRightIcon}
          link="/admin/support"
        />
      </motion.div>

      {/* Main Dashboard Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column - Main Content */}
        <motion.div 
          className="lg:col-span-2 space-y-8"
          variants={itemVariants}
        >
          {/* System Health */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${dashboardData.systemHealth.api === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <h3 className="text-sm font-medium text-gray-700">API Status</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Response time: 230ms</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${dashboardData.systemHealth.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <h3 className="text-sm font-medium text-gray-700">Database Status</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Query time: 45ms</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${dashboardData.systemHealth.jobs === 'healthy' ? 'bg-green-500' : dashboardData.systemHealth.jobs === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                    <h3 className="text-sm font-medium text-gray-700">Cron Jobs</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Last run: 15 minutes ago</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Revenue Summary */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
                  <div className="flex items-center mt-2">
                    <p className="text-2xl font-bold">${dashboardData.revenue.today.toLocaleString()}</p>
                    <div className="ml-3 flex items-center">
                      {dashboardData.revenue.todayChange > 0 ? (
                        <>
                          <ArrowUpIcon className="w-4 h-4 text-emerald-500 mr-1" />
                          <span className="text-sm font-medium text-emerald-500">{dashboardData.revenue.todayChange}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                          <span className="text-sm font-medium text-red-500">{Math.abs(dashboardData.revenue.todayChange)}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Volume Processed</p>
                  <p className="text-2xl font-bold mt-2">${dashboardData.revenue.volume.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-6 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Revenue chart will be displayed here</p>
              </div>
            </div>
          </motion.div>
          
          {/* Recent Activities */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Admin Activities</h2>
                <Link href="/admin/activities" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {/* Sample activities */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-emerald-100 rounded-full p-2 mr-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Transaction approved</p>
                    <p className="text-sm text-gray-500">Admin approved withdrawal of $2,500 for user #8721</p>
                    <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                    <UsersIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">User status updated</p>
                    <p className="text-sm text-gray-500">Admin changed KYC status to 'Verified' for user #9035</p>
                    <p className="text-xs text-gray-400 mt-1">25 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-amber-100 rounded-full p-2 mr-3">
                    <ExclamationCircleIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">System setting changed</p>
                    <p className="text-sm text-gray-500">Admin updated withdrawal fee from 0.5% to 0.4%</p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Sidebar */}
        <motion.div 
          className="space-y-8"
          variants={itemVariants}
        >
          {/* Quick Actions */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/admin/users/create" className="block w-full bg-navy-50 hover:bg-navy-100 text-navy-700 py-3 px-4 rounded-lg transition-colors text-sm font-medium">
                  Create New User
                </Link>
                <Link href="/admin/transactions?status=pending" className="block w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 px-4 rounded-lg transition-colors text-sm font-medium">
                  Review Pending Transactions
                </Link>
                <Link href="/admin/notifications/create" className="block w-full bg-amber-50 hover:bg-amber-100 text-amber-700 py-3 px-4 rounded-lg transition-colors text-sm font-medium">
                  Send System Notification
                </Link>
                <Link href="/admin/logs" className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg transition-colors text-sm font-medium">
                  View System Logs
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Pending Approvals */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {dashboardData.pendingTransactions} items
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-amber-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Withdrawal Request</p>
                      <p className="text-xs text-gray-500">User #8721 • $2,500</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium hover:bg-emerald-200 transition-colors">
                      Approve
                    </button>
                    <button className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium hover:bg-red-200 transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-amber-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">KYC Verification</p>
                      <p className="text-xs text-gray-500">User #9035 • Passport</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium hover:bg-emerald-200 transition-colors">
                      Verify
                    </button>
                    <button className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium hover:bg-red-200 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-amber-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Deposit Confirmation</p>
                      <p className="text-xs text-gray-500">User #7456 • $5,000</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium hover:bg-emerald-200 transition-colors">
                      Confirm
                    </button>
                    <button className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium hover:bg-red-200 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/transactions?status=pending" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                  View all pending items →
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Recent Support Tickets */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Support Tickets</h2>
                <Link href="/admin/support" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-900">Withdrawal not received</p>
                  <p className="text-xs text-gray-500">User #8721 • 15 minutes ago</p>
                </div>
                <div className="border-l-4 border-amber-500 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-900">KYC verification issue</p>
                  <p className="text-xs text-gray-500">User #9035 • 1 hour ago</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-900">Account access problem</p>
                  <p className="text-xs text-gray-500">User #7456 • 3 hours ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}