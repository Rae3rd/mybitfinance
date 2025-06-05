'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TransactionsManagement() {
  // State for search, filters, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock transaction data
  const mockTransactions = [
    {
      id: 'TX123456789',
      userId: '1',
      userName: 'John Doe',
      type: 'deposit',
      amount: 5000.00,
      currency: 'USD',
      status: 'completed',
      date: '2023-06-10T14:30:00',
      method: 'bank_transfer',
      description: 'Bank deposit'
    },
    {
      id: 'TX987654321',
      userId: '2',
      userName: 'Jane Smith',
      type: 'withdrawal',
      amount: 2500.00,
      currency: 'USD',
      status: 'pending',
      date: '2023-06-09T16:45:00',
      method: 'wire_transfer',
      description: 'Withdrawal to bank account'
    },
    {
      id: 'TX456789123',
      userId: '3',
      userName: 'Robert Johnson',
      type: 'purchase',
      amount: 1200.50,
      currency: 'USD',
      status: 'completed',
      date: '2023-06-08T10:15:00',
      method: 'credit_card',
      description: 'Purchase of BTC'
    },
    {
      id: 'TX789123456',
      userId: '4',
      userName: 'Emily Davis',
      type: 'sale',
      amount: 3500.75,
      currency: 'USD',
      status: 'completed',
      date: '2023-06-07T09:30:00',
      method: 'platform',
      description: 'Sale of ETH'
    },
    {
      id: 'TX321654987',
      userId: '5',
      userName: 'Michael Wilson',
      type: 'withdrawal',
      amount: 10000.00,
      currency: 'USD',
      status: 'rejected',
      date: '2023-06-06T15:20:00',
      method: 'wire_transfer',
      description: 'Withdrawal rejected due to KYC issues'
    },
    {
      id: 'TX654987321',
      userId: '6',
      userName: 'Sarah Brown',
      type: 'deposit',
      amount: 7500.00,
      currency: 'USD',
      status: 'pending',
      date: '2023-06-05T11:45:00',
      method: 'bank_transfer',
      description: 'Bank deposit pending verification'
    },
    {
      id: 'TX159753486',
      userId: '7',
      userName: 'David Lee',
      type: 'purchase',
      amount: 950.25,
      currency: 'USD',
      status: 'completed',
      date: '2023-06-04T13:10:00',
      method: 'platform',
      description: 'Purchase of SOL'
    },
    {
      id: 'TX753159486',
      userId: '8',
      userName: 'Lisa Taylor',
      type: 'sale',
      amount: 2100.50,
      currency: 'USD',
      status: 'completed',
      date: '2023-06-03T10:05:00',
      method: 'platform',
      description: 'Sale of ADA'
    },
  ];

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

  // Filter transactions based on search query and filters
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.userId.includes(searchQuery);
    
    const matchesStatusFilter = 
      filterStatus === 'all' ||
      transaction.status === filterStatus;
    
    const matchesTypeFilter = 
      filterType === 'all' ||
      transaction.type === filterType;
    
    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Handle type filter change
  const handleTypeFilterChange = (type: string) => {
    setFilterType(type);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Simulate loading data
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Get transaction type icon
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="h-5 w-5 text-emerald-500" />;
      case 'withdrawal':
        return <ArrowUpIcon className="h-5 w-5 text-amber-500" />;
      case 'purchase':
        return <BanknotesIcon className="h-5 w-5 text-blue-500" />;
      case 'sale':
        return <BanknotesIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <BanknotesIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-amber-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format date to local string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format relative time
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
          Transaction Management
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage all financial transactions on the platform.
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
              placeholder="Search by transaction ID, user name or user ID..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Transaction Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleStatusFilterChange('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'all' ? 'bg-navy-100 text-navy-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    All Statuses
                  </button>
                  <button 
                    onClick={() => handleStatusFilterChange('completed')}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Completed
                  </button>
                  <button 
                    onClick={() => handleStatusFilterChange('pending')}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => handleStatusFilterChange('rejected')}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Rejected
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Transaction Type</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleTypeFilterChange('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${filterType === 'all' ? 'bg-navy-100 text-navy-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    All Types
                  </button>
                  <button 
                    onClick={() => handleTypeFilterChange('deposit')}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${filterType === 'deposit' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Deposits
                  </button>
                  <button 
                    onClick={() => handleTypeFilterChange('withdrawal')}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${filterType === 'withdrawal' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Withdrawals
                  </button>
                  <button 
                    onClick={() => handleTypeFilterChange('purchase')}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${filterType === 'purchase' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Purchases
                  </button>
                  <button 
                    onClick={() => handleTypeFilterChange('sale')}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${filterType === 'sale' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Sales
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Transactions Table */}
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
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <motion.tr 
                    key={transaction.id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.userName}</div>
                        <div className="text-xs text-gray-500">ID: {transaction.userId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getTransactionTypeIcon(transaction.type)}
                        </div>
                        <span className="text-sm text-gray-900 capitalize">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'deposit' || transaction.type === 'sale' ? 'text-emerald-600' : 'text-amber-600'}>
                        {transaction.type === 'deposit' || transaction.type === 'sale' ? '+' : '-'}
                        ${transaction.amount.toLocaleString()} {transaction.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getStatusIcon(transaction.status)}
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRelativeTime(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/admin/transactions/${transaction.id}`}
                          className="text-navy-600 hover:text-navy-900 p-1 rounded-full hover:bg-navy-50 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        {transaction.status === 'pending' && (
                          <>
                            <button 
                              className="text-emerald-600 hover:text-emerald-900 p-1 rounded-full hover:bg-emerald-50 transition-colors"
                              title="Approve Transaction"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                              title="Reject Transaction"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <ExclamationTriangleIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">No transactions found</p>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of{' '}
                <span className="font-medium">{filteredTransactions.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  1
                </button>
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  disabled={true}
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

      {/* Transaction Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Deposits (24h)</p>
              <p className="text-2xl font-bold mt-1">$12,500.00</p>
              <p className="text-sm text-emerald-600 mt-1">+15.3% vs yesterday</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <ArrowDownIcon className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Withdrawals (24h)</p>
              <p className="text-2xl font-bold mt-1">$8,750.00</p>
              <p className="text-sm text-amber-600 mt-1">+5.7% vs yesterday</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <ArrowUpIcon className="w-8 h-8 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Transactions</p>
              <p className="text-2xl font-bold mt-1">34</p>
              <p className="text-sm text-gray-500 mt-1">Requires review</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <ClockIcon className="w-8 h-8 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Transaction Volume (24h)</p>
              <p className="text-2xl font-bold mt-1">$145,250.00</p>
              <p className="text-sm text-emerald-600 mt-1">+12.8% vs yesterday</p>
            </div>
            <div className="bg-navy-50 p-3 rounded-lg">
              <BanknotesIcon className="w-8 h-8 text-navy-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}