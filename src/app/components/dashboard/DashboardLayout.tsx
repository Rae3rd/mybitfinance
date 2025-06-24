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
  CurrencyDollarIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const sidebarVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Portfolio', href: '/dashboard/portfolio', icon: ArrowTrendingUpIcon },
    { name: 'Wallet', href: '/dashboard/wallet', icon: WalletIcon },
    { name: 'Market', href: '/dashboard/market', icon: CurrencyDollarIcon },
    { name: 'Activity', href: '/dashboard/activity', icon: ClockIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    { name: 'Referrals', href: '/dashboard/referrals', icon: UserGroupIcon },
    { name: 'Help', href: '/dashboard/help', icon: QuestionMarkCircleIcon },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              className="fixed inset-0 flex z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Overlay */}
              <motion.div 
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />
              
              {/* Sidebar */}
              <motion.div 
                className="relative flex-1 flex flex-col max-w-xs w-full bg-navy-900"
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <Link href="/dashboard" className="flex items-center">
                      <SparklesIcon className="h-8 w-8 text-emerald-500" />
                      <span className="ml-2 text-xl font-bold text-white">MyBitFinance</span>
                    </Link>
                  </div>
                  <nav className="mt-8 px-2 space-y-1">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group flex items-center px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${isActive ? 'bg-navy-800 text-white' : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
                        >
                          <item.icon
                            className={`mr-4 h-6 w-6 transition-colors duration-200 ${isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}`}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
                
                <div className="flex-shrink-0 flex border-t border-navy-800 p-4">
                  <Link href="/sign-out" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
                    <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3 text-gray-400" />
                    <span>Sign out</span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop sidebar - Collapsible */}
      <div className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
        <div className={`flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
          <div className="flex flex-col h-0 flex-1 bg-navy-900">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className={`flex items-center flex-shrink-0 px-4 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                <Link href="/dashboard" className="flex items-center">
                  <SparklesIcon className="h-8 w-8 text-emerald-500" />
                  {!sidebarCollapsed && <span className="ml-2 text-xl font-bold text-white">MyBitFinance</span>}
                </Link>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${isActive ? 'bg-navy-800 text-white' : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
                      title={sidebarCollapsed ? item.name : ''}
                    >
                      <item.icon
                        className={`${sidebarCollapsed ? '' : 'mr-4'} h-6 w-6 transition-colors duration-200 ${isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}`}
                        aria-hidden="true"
                      />
                      {!sidebarCollapsed && item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-navy-800 p-4 justify-center">
              {sidebarCollapsed ? (
                <Link href="/sign-out" className="flex items-center justify-center text-gray-300 hover:text-white transition-colors duration-200" title="Sign out">
                  <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-400" />
                </Link>
              ) : (
                <Link href="/sign-out" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
                  <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3 text-gray-400" />
                  <span>Sign out</span>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Toggle button for sidebar */}
        <div className="relative">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-10 bg-navy-900 text-white rounded-full p-1 shadow-lg border border-navy-800 hover:bg-navy-800 transition-colors duration-200"
          >
            {sidebarCollapsed ? 
              <ChevronRightIcon className="h-4 w-4" /> : 
              <ChevronLeftIcon className="h-4 w-4" />
            }
          </button>
        </div>
      </div>

      {/* Floating action button for mobile */}
      <div className="lg:hidden fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-navy-900 text-white p-3 rounded-full shadow-lg hover:bg-navy-800 transition-colors duration-200 flex items-center justify-center"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="lg:hidden">
                <button
                  className="h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="flex-1 flex justify-end">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Notification dropdown */}
                  <div className="ml-3 relative" data-dropdown>
                    <button
                      className="bg-white p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      onClick={() => {
                        setNotificationsOpen(!notificationsOpen);
                        setShowProfileMenu(false);
                      }}
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                      <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>
                    
                    <AnimatePresence>
                      {notificationsOpen && (
                        <motion.div
                          className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <div className="py-1">
                            <div className="px-4 py-3 border-b border-gray-100">
                              <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 bg-emerald-500 rounded-full p-1">
                                    <CurrencyDollarIcon className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="ml-3 w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900">Deposit confirmed</p>
                                    <p className="text-xs text-gray-500">Your deposit of $500 has been confirmed</p>
                                    <p className="mt-1 text-xs text-gray-400">2 hours ago</p>
                                  </div>
                                </div>
                              </div>
                              <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 bg-blue-500 rounded-full p-1">
                                    <ArrowTrendingUpIcon className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="ml-3 w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900">Portfolio update</p>
                                    <p className="text-xs text-gray-500">BTC is up 5.3% in the last 24 hours</p>
                                    <p className="mt-1 text-xs text-gray-400">5 hours ago</p>
                                  </div>
                                </div>
                              </div>
                              <div className="px-4 py-3 hover:bg-gray-50">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 bg-purple-500 rounded-full p-1">
                                    <SparklesIcon className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="ml-3 w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900">New feature available</p>
                                    <p className="text-xs text-gray-500">Try our new portfolio analytics tools</p>
                                    <p className="mt-1 text-xs text-gray-400">1 day ago</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100 text-center">
                              <a href="/dashboard/notifications" className="text-xs font-medium text-emerald-600 hover:text-emerald-500">
                                View all notifications
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile dropdown */}
                  <div className="ml-3 relative" data-dropdown>
                    <div>
                      <button
                        className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        onClick={() => {
                          setShowProfileMenu(!showProfileMenu);
                          setNotificationsOpen(false);
                        }}
                      >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
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
        
        {/* Remove Footer component */}
      </div>
    </div>
  );
};

export default DashboardLayout;