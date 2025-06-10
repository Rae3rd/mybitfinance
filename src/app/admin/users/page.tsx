'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  PencilSquareIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useUsers } from '../../../lib/hooks/useAdminData';
import { toast } from 'sonner';

// Extended user interface for the component
interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  kycStatus: string;
  registrationDate: string;
  lastLogin: string;
  portfolioValue: number;
}

// Define the structure of the API response
interface UsersResponse {
  users: User[];
  totalPages: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function UsersManagement() {
  // State for search, filters, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch users data
  const { 
    data: usersData, 
    isLoading, 
    error 
  } = useUsers({
    page: currentPage,
    limit: 10,
    search: searchQuery,
    status: filterStatus === 'all' ? undefined : filterStatus
  }) as { data: UsersResponse | undefined; isLoading: boolean; error: Error | null };
  
  // Handle API errors
  if (error) {
    toast.error('Failed to load users data');
  }
  
  const users = usersData?.users || [];
  const totalPages = usersData?.pagination?.totalPages || 1;
  
  // Fallback data for when API is loading
  const fallbackUsers: User[] = [];
  
  // Use API data or fallback
  const displayUsers = users.length > 0 ? users : fallbackUsers;

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

  // Filtering is now handled by the API through the useUsers hook parameters

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle filter change
  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Refresh data by refetching from API
  const refreshData = () => {
    // The useUsers hook will automatically refetch when dependencies change
    // We can force a refetch by changing the currentPage and then changing it back
    setCurrentPage(prev => prev + 1);
    setTimeout(() => setCurrentPage(prev => prev - 1), 10);
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get KYC status badge styling
  const getKycStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'not_submitted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date to local string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format datetime to relative time
  const formatRelativeTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateTimeString);
    }
  };

  return (
    <>
      {/* Page Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-navy-600 to-emerald-500 bg-clip-text text-transparent animate-text-shimmer">
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage all user accounts on the platform.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-4 w-4 mr-2 text-gray-500" />
              Filters
            </button>
            
            <button 
              onClick={refreshData}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <Link 
              href="/admin/users/create"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <span className="hidden md:inline">Add New User</span>
              <span className="md:hidden">+ New</span>
            </Link>
          </div>
        </div>
        
        {/* Expandable filters */}
        {showFilters && (
          <motion.div 
            className="mt-4 pt-4 border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'all' ? 'bg-navy-100 text-navy-800' : 'bg-gray-100 text-gray-800'}`}
              >
                All Users
              </button>
              <button 
                onClick={() => handleFilterChange('active')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}
              >
                Active
              </button>
              <button 
                onClick={() => handleFilterChange('inactive')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'inactive' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-800'}`}
              >
                Inactive
              </button>
              <button 
                onClick={() => handleFilterChange('suspended')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
              >
                Suspended
              </button>
              <button 
                onClick={() => handleFilterChange('verified')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}
              >
                KYC Verified
              </button>
              <button 
                onClick={() => handleFilterChange('pending')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}
              >
                KYC Pending
              </button>
              <button 
                onClick={() => handleFilterChange('rejected')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
              >
                KYC Rejected
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Users Table */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KYC Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Portfolio Value
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="ml-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-48"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : displayUsers.length > 0 ? (
                displayUsers.map((user: User) => (
                  <motion.tr 
                    key={user.id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-navy-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getKycStatusBadgeClass(user.kycStatus)}`}>
                        {user.kycStatus === 'not_submitted' ? 'Not Submitted' : 
                          user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.registrationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRelativeTime(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${user.portfolioValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/admin/users/${user.id}`}
                          className="text-navy-600 hover:text-navy-900 p-1 rounded-full hover:bg-navy-50 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link 
                          href={`/admin/users/${user.id}/edit`}
                          className="text-emerald-600 hover:text-emerald-900 p-1 rounded-full hover:bg-emerald-50 transition-colors"
                          title="Edit User"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </Link>
                        <button 
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <ExclamationTriangleIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(currentPage * 10, usersData?.pagination?.total || 0)}</span> of{' '}
                <span className="font-medium">{usersData?.pagination?.total || 0}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                  }`}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-navy-50 border-navy-500 text-navy-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                  }`}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}