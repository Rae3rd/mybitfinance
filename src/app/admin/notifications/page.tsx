'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  CheckCircleIcon,
  XCircleIcon,
  BellAlertIcon,
  BellIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

type NotificationType = 'info' | 'warning' | 'success' | 'error';
type RelatedEntityType = 'user' | 'transaction' | 'support' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  relatedEntity: {
    type: RelatedEntityType;
    id: string;
    name?: string;
  };
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsManagement() {
  const { user } = useUser();
  
  // State for search, filters, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<RelatedEntityType[]>([]);
  const [readStatus, setReadStatus] = useState<'all' | 'read' | 'unread'>('all');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    message: '',
    type: 'info' as NotificationType,
    relatedEntityType: 'system' as RelatedEntityType,
    relatedEntityId: '',
  });

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      message: 'New user registration: John Doe',
      relatedEntity: {
        type: 'user',
        id: 'user-123',
        name: 'John Doe',
      },
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    },
    {
      id: '2',
      type: 'warning',
      message: 'Withdrawal request pending approval: $5,000 USD',
      relatedEntity: {
        type: 'transaction',
        id: 'tx-456',
        name: 'Withdrawal #TX-456',
      },
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    },
    {
      id: '3',
      type: 'success',
      message: 'System update completed successfully',
      relatedEntity: {
        type: 'system',
        id: 'sys-789',
      },
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    },
    {
      id: '4',
      type: 'info',
      message: 'New support ticket opened: Account verification issue',
      relatedEntity: {
        type: 'support',
        id: 'ticket-101',
        name: 'Ticket #101',
      },
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    },
    {
      id: '5',
      type: 'error',
      message: 'Payment gateway connection error detected',
      relatedEntity: {
        type: 'system',
        id: 'sys-202',
      },
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
    {
      id: '6',
      type: 'warning',
      message: 'Unusual login activity detected for user Sarah Smith',
      relatedEntity: {
        type: 'user',
        id: 'user-303',
        name: 'Sarah Smith',
      },
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    },
    {
      id: '7',
      type: 'success',
      message: 'Large deposit confirmed: $25,000 USD',
      relatedEntity: {
        type: 'transaction',
        id: 'tx-404',
        name: 'Deposit #TX-404',
      },
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: '8',
      type: 'info',
      message: 'New KYC documents submitted by user Michael Johnson',
      relatedEntity: {
        type: 'user',
        id: 'user-505',
        name: 'Michael Johnson',
      },
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    },
    {
      id: '9',
      type: 'warning',
      message: 'Multiple failed login attempts for admin account',
      relatedEntity: {
        type: 'system',
        id: 'sys-606',
      },
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
    {
      id: '10',
      type: 'success',
      message: 'Support ticket #95 resolved successfully',
      relatedEntity: {
        type: 'support',
        id: 'ticket-95',
        name: 'Ticket #95',
      },
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    },
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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

  // Filter notifications based on search query and filters
  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notification.relatedEntity.name && notification.relatedEntity.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Type filter
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(notification.type);
    
    // Entity filter
    const matchesEntity = selectedEntities.length === 0 || selectedEntities.includes(notification.relatedEntity.type);
    
    // Read status filter
    const matchesReadStatus = 
      readStatus === 'all' || 
      (readStatus === 'read' && notification.isRead) || 
      (readStatus === 'unread' && !notification.isRead);
    
    // Date range filter
    let matchesDateRange = true;
    const notificationDate = new Date(notification.createdAt);
    const now = new Date();
    
    if (dateRange === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      matchesDateRange = notificationDate >= today;
    } else if (dateRange === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDateRange = notificationDate >= sevenDaysAgo;
    } else if (dateRange === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDateRange = notificationDate >= thirtyDaysAgo;
    }
    
    return matchesSearch && matchesType && matchesEntity && matchesReadStatus && matchesDateRange;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle notification selection
  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) ? prev.filter(notifId => notifId !== id) : [...prev, id]
    );
  };

  // Handle select all notifications
  const toggleSelectAll = () => {
    if (selectedNotifications.length === paginatedNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(paginatedNotifications.map(notification => notification.id));
    }
  };

  // Handle mark as read/unread
  const handleMarkReadStatus = (isRead: boolean) => {
    if (selectedNotifications.length === 0) return;
    
    setNotifications(prev => prev.map(notification => 
      selectedNotifications.includes(notification.id) 
        ? { ...notification, isRead } 
        : notification
    ));
    
    // In a real app, you would call an API here
    // Example: selectedNotifications.forEach(id => updateNotificationReadStatus(id, isRead));
    
    setSelectedNotifications([]);
  };

  // Handle delete notifications
  const handleDeleteNotifications = () => {
    if (selectedNotifications.length === 0) return;
    
    setNotifications(prev => 
      prev.filter(notification => !selectedNotifications.includes(notification.id))
    );
    
    // In a real app, you would call an API here
    // Example: deleteNotifications(selectedNotifications);
    
    setSelectedNotifications([]);
  };

  // Handle view notification details
  const handleViewNotification = (notification: Notification) => {
    setCurrentNotification(notification);
    setIsDetailModalOpen(true);
    
    // Mark as read when viewed
    if (!notification.isRead) {
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      ));
      
      // In a real app, you would call an API here
      // Example: updateNotificationReadStatus(notification.id, true);
    }
  };

  // Handle create new notification
  const handleCreateNotification = () => {
    // In a real app, you would call an API here and get a response with the created notification
    const createdNotification: Notification = {
      id: `new-${Date.now()}`,
      type: newNotification.type,
      message: newNotification.message,
      relatedEntity: {
        type: newNotification.relatedEntityType,
        id: newNotification.relatedEntityId || `auto-${Date.now()}`,
        name: newNotification.relatedEntityType === 'user' ? 'User Name' : 
              newNotification.relatedEntityType === 'transaction' ? 'Transaction ID' : 
              newNotification.relatedEntityType === 'support' ? 'Ticket ID' : undefined
      },
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [createdNotification, ...prev]);
    setIsCreateModalOpen(false);
    setNewNotification({
      message: '',
      type: 'info',
      relatedEntityType: 'system',
      relatedEntityId: '',
    });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch(type) {
      case 'info': return <BellIcon className="h-5 w-5 text-blue-500" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />;
      case 'success': return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />;
      case 'error': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default: return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get related entity icon
  const getRelatedEntityIcon = (type: RelatedEntityType) => {
    switch(type) {
      case 'user': return <UserIcon className="h-5 w-5 text-indigo-500" />;
      case 'transaction': return <CurrencyDollarIcon className="h-5 w-5 text-emerald-500" />;
      case 'support': return <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />;
      case 'system': return <ShieldCheckIcon className="h-5 w-5 text-purple-500" />;
      default: return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Notifications Management</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 text-sm font-medium"
          >
            <BellAlertIcon className="h-4 w-4" />
            <span>Create Notification</span>
          </button>
          <button
            onClick={() => handleMarkReadStatus(true)}
            disabled={selectedNotifications.length === 0}
            className={`p-2 rounded-lg ${selectedNotifications.length > 0 ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-colors`}
            title="Mark as Read"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleMarkReadStatus(false)}
            disabled={selectedNotifications.length === 0}
            className={`p-2 rounded-lg ${selectedNotifications.length > 0 ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-colors`}
            title="Mark as Unread"
          >
            <EnvelopeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleDeleteNotifications}
            disabled={selectedNotifications.length === 0}
            className={`p-2 rounded-lg ${selectedNotifications.length > 0 ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-colors`}
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Export"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notifications..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              value={readStatus}
              onChange={(e) => setReadStatus(e.target.value as 'all' | 'read' | 'unread')}
            >
              <option value="all">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
            
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'today' | '7days' | '30days' | 'all')}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
            
            <div className="relative">
              <button
                className="flex items-center space-x-1 border border-gray-300 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                onClick={() => document.getElementById('typeDropdown')?.classList.toggle('hidden')}
              >
                <FunnelIcon className="h-4 w-4 text-gray-500" />
                <span>Type</span>
              </button>
              <div id="typeDropdown" className="absolute z-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2 hidden">
                <div className="space-y-1">
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes('info')}
                      onChange={() => {
                        setSelectedTypes(prev => 
                          prev.includes('info') 
                            ? prev.filter(t => t !== 'info') 
                            : [...prev, 'info']
                        );
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="flex items-center">
                      <BellIcon className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Info</span>
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes('warning')}
                      onChange={() => {
                        setSelectedTypes(prev => 
                          prev.includes('warning') 
                            ? prev.filter(t => t !== 'warning') 
                            : [...prev, 'warning']
                        );
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 text-amber-500 mr-2" />
                      <span>Warning</span>
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes('success')}
                      onChange={() => {
                        setSelectedTypes(prev => 
                          prev.includes('success') 
                            ? prev.filter(t => t !== 'success') 
                            : [...prev, 'success']
                        );
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-emerald-500 mr-2" />
                      <span>Success</span>
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes('error')}
                      onChange={() => {
                        setSelectedTypes(prev => 
                          prev.includes('error') 
                            ? prev.filter(t => t !== 'error') 
                            : [...prev, 'error']
                        );
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="flex items-center">
                      <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                      <span>Error</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <button
                className="flex items-center space-x-1 border border-gray-300 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                onClick={() => document.getElementById('entityDropdown')?.classList.toggle('hidden')}
              >
                <FunnelIcon className="h-4 w-4 text-gray-500" />
                <span>Entity</span>
              </button>
              <div id="entityDropdown" className="absolute z-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2 hidden">
                <div className="space-y-1">
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEntities.includes('user')}
                      onChange={() => {
                        setSelectedEntities(prev => 
                          prev.includes('user') 
                            ? prev.filter(e => e !== 'user') 
                            : [...prev, 'user']
                        );
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="flex items-center">
                      <UserIcon className="h-4 w-4 text-indigo-500 mr-2" />
                      <span>User</span>
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEntities.includes('transaction')}
                      onChange={() => {
                        setSelectedEntities(prev => 
                          prev.includes('transaction') 
                            ? prev.filter(e => e !== 'transaction') 
                            : [...prev, 'transaction']
                        );
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 text-emerald-500 mr-2" />
                      <span>Transaction</span>
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEntities.includes('support')}
                      onChange={() => {
                        setSelectedEntities(prev => 
                          prev.includes('support') 
                            ? prev.filter(e => e !== 'support') 
                            : [...prev, 'support']
                        );
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="flex items-center">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Support</span>
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEntities.includes('system')}
                      onChange={() => {
                        setSelectedEntities(prev => 
                          prev.includes('system') 
                            ? prev.filter(e => e !== 'system') 
                            : [...prev, 'system']
                        );
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="flex items-center">
                      <ShieldCheckIcon className="h-4 w-4 text-purple-500 mr-2" />
                      <span>System</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications Table */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={paginatedNotifications.length > 0 && selectedNotifications.length === paginatedNotifications.length}
                    onChange={toggleSelectAll}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Related Entity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedNotifications.length > 0 ? (
                paginatedNotifications.map((notification) => (
                  <motion.tr 
                    key={notification.id}
                    variants={itemVariants}
                    className={`hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleNotificationSelection(notification.id)}
                        className="rounded text-emerald-500 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{notification.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRelatedEntityIcon(notification.relatedEntity.type)}
                        <span className="ml-2 text-sm text-gray-500">
                          {notification.relatedEntity.name || notification.relatedEntity.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(notification.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${notification.isRead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
                        {notification.isRead ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewNotification(notification)}
                        className="text-emerald-600 hover:text-emerald-900 mr-3"
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No notifications found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredNotifications.length)}</span> of{' '}
                  <span className="font-medium">{filteredNotifications.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">First</span>
                    <span>«</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Previous</span>
                    <span>‹</span>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Next</span>
                    <span>›</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Last</span>
                    <span>»</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Notification Detail Modal */}
      {isDetailModalOpen && currentNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                {getNotificationIcon(currentNotification.type)}
                <span className="ml-2">Notification Details</span>
              </h3>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Message</h4>
                  <p className="mt-1 text-sm text-gray-900">{currentNotification.message}</p>
                </div>
                <div className="flex space-x-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Type</h4>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      {getNotificationIcon(currentNotification.type)}
                      <span className="ml-2 capitalize">{currentNotification.type}</span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="mt-1 text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currentNotification.isRead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
                        {currentNotification.isRead ? 'Read' : 'Unread'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Created</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(currentNotification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Related Entity</h4>
                  <div className="mt-1 flex items-center">
                    {getRelatedEntityIcon(currentNotification.relatedEntity.type)}
                    <span className="ml-2 text-sm text-gray-900">
                      {currentNotification.relatedEntity.name || currentNotification.relatedEntity.type} ({currentNotification.relatedEntity.id})
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500">Actions</h4>
                  <div className="mt-2 flex space-x-3">
                    <button
                      onClick={() => {
                        // In a real app, you would navigate to the related entity
                        // Example: router.push(`/admin/${currentNotification.relatedEntity.type}s/${currentNotification.relatedEntity.id}`);
                        setIsDetailModalOpen(false);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      View Related {currentNotification.relatedEntity.type.charAt(0).toUpperCase() + currentNotification.relatedEntity.type.slice(1)}
                    </button>
                    <button
                      onClick={() => {
                        setNotifications(prev => prev.filter(n => n.id !== currentNotification.id));
                        setIsDetailModalOpen(false);
                      }}
                      className="px-3 py-1.5 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 text-right">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Notification Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BellAlertIcon className="h-5 w-5 text-emerald-500 mr-2" />
                <span>Create New Notification</span>
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Enter notification message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      id="type"
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      value={newNotification.type}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value as NotificationType }))}
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="relatedEntityType" className="block text-sm font-medium text-gray-700">Related Entity Type</label>
                    <select
                      id="relatedEntityType"
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      value={newNotification.relatedEntityType}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, relatedEntityType: e.target.value as RelatedEntityType }))}
                    >
                      <option value="user">User</option>
                      <option value="transaction">Transaction</option>
                      <option value="support">Support</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="relatedEntityId" className="block text-sm font-medium text-gray-700">Related Entity ID (Optional)</label>
                  <input
                    type="text"
                    id="relatedEntityId"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Enter ID or leave blank for auto-generated"
                    value={newNotification.relatedEntityId}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, relatedEntityId: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotification}
                disabled={!newNotification.message.trim()}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${!newNotification.message.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'} transition-colors`}
              >
                Create Notification
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Click outside handler for dropdowns */}
      {/* Click outside handler for dropdowns */}
      <>
      {useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          const typeDropdown = document.getElementById('typeDropdown');
          const entityDropdown = document.getElementById('entityDropdown');
          
          if (typeDropdown && !typeDropdown.contains(event.target as Node) && 
              !((event.target as HTMLElement)?.closest?.('button')?.nextElementSibling?.id?.includes('typeDropdown'))) {
            typeDropdown.classList.add('hidden');
          }
          
          if (entityDropdown && !entityDropdown.contains(event.target as Node) && 
              !((event.target as HTMLElement)?.closest?.('button')?.nextElementSibling?.id?.includes('entityDropdown'))) {
            entityDropdown.classList.add('hidden');
          }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, [])}
      </>
    </div>
  );
}