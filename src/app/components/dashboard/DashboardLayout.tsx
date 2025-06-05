'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { 
  ChartBarIcon, 
  UserIcon, 
  WalletIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  SparklesIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const pathname = usePathname();
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsOpen || showProfileMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setNotificationsOpen(false);
          setShowProfileMenu(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen, showProfileMenu]);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    { name: 'Portfolio', href: '/dashboard/portfolio', icon: ArrowTrendingUpIcon },
    { name: 'Transactions', href: '/dashboard/transactions', icon: ClockIcon },
    { name: 'Wallet', href: '/dashboard/wallet', icon: WalletIcon },
    { name: 'Referrals', href: '/dashboard/referrals', icon: UserGroupIcon },
    { name: 'Investments', href: '/dashboard/investments', icon: CurrencyDollarIcon },
    { name: 'Support', href: 'https://t.me/mybitfinance', icon: QuestionMarkCircleIcon, external: true },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, message: 'Deposit of $500 approved', time: '2 minutes ago', type: 'success' },
    { id: 2, message: 'Bitcoin price alert: +5%', time: '1 hour ago', type: 'info' },
    { id: 3, message: 'New referral bonus earned', time: '1 day ago', type: 'reward' },
    { id: 4, message: 'Complete your KYC verification', time: '2 days ago', type: 'warning' },
  ];

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
  
  const pulseVariants = {
    initial: { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
    pulse: {
      boxShadow: [
        '0 0 0 0 rgba(16, 185, 129, 0.7)',
        '0 0 0 10px rgba(16, 185, 129, 0)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'reward': return '🎁';
      default: return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white transform lg:translate-x-0 lg:static lg:inset-auto lg:flex-shrink-0"
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-navy-700">
            <Link href="/" className="flex items-center space-x-1 group">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', repeatDelay: 5 }}
              >
                <SparklesIcon className="h-6 w-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </motion.div>
              <div>
                <span className="text-emerald-400 font-bold text-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all">MyBit</span>
                <span className="text-white font-medium">Finance</span>
              </div>
            </Link>
            <button 
              className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div 
                  key={item.name} 
                  whileHover={{ x: 5 }} 
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-navy-700 to-navy-800 text-emerald-400 shadow-md' : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
                    >
                      <motion.div
                        animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                      </motion.div>
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-navy-700 to-navy-800 text-emerald-400 shadow-md' : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
                    >
                      <motion.div
                        animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                      </motion.div>
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              );
            })}
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
              <button
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-navy-800 hover:text-white transition-colors"
                onClick={() => {
                  // Handle logout logic here
                }}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </motion.div>
          </nav>

          <div className="p-4 border-t border-navy-700">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="flex-shrink-0">
                {user?.imageUrl ? (
                  <motion.img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-emerald-500"
                    initial="initial"
                    whileHover="pulse"
                    variants={pulseVariants}
                  />
                ) : (
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium shadow-lg"
                    initial="initial"
                    whileHover="pulse"
                    variants={pulseVariants}
                  >
                    {user?.firstName?.charAt(0) || 'U'}
                  </motion.div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <motion.button
                className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setSidebarOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bars3Icon className="w-6 h-6" />
              </motion.button>

              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="w-full max-w-lg lg:max-w-xs">
                  <motion.h1 
                    className="text-xl font-semibold bg-gradient-to-r from-navy-600 to-emerald-500 bg-clip-text text-transparent lg:hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    MyBit Finance
                  </motion.h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications dropdown */}
                <div className="relative" data-dropdown>
                  <motion.button
                    className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" />
                    <motion.span 
                      className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    ></motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div 
                        className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-navy-50 to-gray-50">
                            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                            <p className="text-xs text-gray-500 mt-1">Stay updated with your investments</p>
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {notifications.map((notification) => (
                              <motion.a
                                key={notification.id}
                                href="#"
                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-l-4 border-transparent hover:border-emerald-500 transition-all"
                                role="menuitem"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                              >
                                <div className="flex">
                                  <span className="mr-2">{getNotificationIcon(notification.type)}</span>
                                  <div>
                                    <p className="font-medium">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                  </div>
                                </div>
                              </motion.a>
                            ))}
                          </div>
                          <div className="border-t border-gray-100 px-4 py-3 bg-gradient-to-r from-navy-50 to-gray-50">
                            <a href="/dashboard/notifications" className="text-xs font-medium text-emerald-600 hover:text-emerald-500 flex items-center justify-center">
                              View all notifications
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* User profile dropdown */}
                <div className="relative" data-dropdown>
                  <motion.button
                    className="flex items-center focus:outline-none"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {user?.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full border-2 border-emerald-500"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </motion.button>
                  
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="py-1">
                          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-navy-50 to-gray-50">
                            <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-gray-500 truncate mt-1">{user?.emailAddresses?.[0]?.emailAddress}</p>
                          </div>
                          <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Your Profile
                          </a>
                          <a href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Settings
                          </a>
                          <a href="/sign-out" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100">
                            Sign out
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <motion.div 
            className="py-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants} 
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;