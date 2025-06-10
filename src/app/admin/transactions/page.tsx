'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  FilterIcon,
  RefreshCwIcon,
  SearchIcon,
  CalendarIcon,
  CreditCardIcon,
  ArrowPathIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useTransactions, useTransactionMutations } from '@/lib/hooks/useAdminData';
import { toast } from 'sonner';
import { format } from 'date-fns';
import TransactionDetailModal from '../components/modals/TransactionDetailModal';
import TransactionForm from '../components/forms/TransactionForm';
import { adminApi, Transaction } from '@/lib/adminApi';

export default function TransactionsManagement() {
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  // Fetch transactions data
  const {
    data: transactionsData,
    isLoading,
    error,
    updateFilters,
  } = useTransactions({
    page: currentPage,
    limit: 10,
    status: filterStatus !== 'all' ? filterStatus : undefined,
    type: filterType !== 'all' ? filterType : undefined,
    dateFrom: dateRange.from || undefined,
    dateTo: dateRange.to || undefined,
    search: searchQuery || undefined,
  });

  if (error) {
    toast.error('Failed to load transactions data');
  }

  const transactions = transactionsData?.data || [];
  const totalPages = transactionsData?.pagination?.totalPages || 1;

  // Fallback empty state
  const fallbackTransactions = [];

  // Use transactions if available, otherwise use fallback
  const displayTransactions = transactions.length > 0 ? transactions : fallbackTransactions;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    updateFilters({ search: e.target.value, page: 1 });
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
    updateFilters({ status: status !== 'all' ? status : undefined, page: 1 });
  };

  const handleTypeChange = (type: string) => {
    setFilterType(type);
    setCurrentPage(1);
    updateFilters({ type: type !== 'all' ? type : undefined, page: 1 });
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    setCurrentPage(1);
    updateFilters({
      dateFrom: newDateRange.from || undefined,
      dateTo: newDateRange.to || undefined,
      page: 1,
    });
  };

  const refreshData = () => {
    // The useTransactions hook will automatically refetch when dependencies change
    updateFilters({ page: currentPage });
    toast.success('Data refreshed');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateFilters({ page });
  };

  // Helper functions
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpIcon className="w-5 h-5 text-red-500" />;
      case 'trade':
        return <ArrowPathIcon className="w-5 h-5 text-blue-500" />;
      case 'subscription':
        return <CreditCardIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <BanknotesIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return format(date, 'MMM dd, yyyy HH:mm');
  };

  const formatCurrency = (amount: number, asset: string) => {
    if (asset === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
    return `${amount.toLocaleString()} ${asset}`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Transaction Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage all financial transactions on the platform.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
              placeholder="Search by user or reference ID"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
            >
              <FilterIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Filters
            </button>
            <button
              type="button"
              onClick={refreshData}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
            >
              <RefreshCwIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filterStatus}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={filterType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="trade">Trade</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>

              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                  From Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="date"
                    name="dateFrom"
                    id="dateFrom"
                    value={dateRange.from}
                    onChange={(e) => handleDateChange('from', e.target.value)}
                    className="focus:ring-navy-500 focus:border-navy-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                  To Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="date"
                    name="dateTo"
                    id="dateTo"
                    value={dateRange.to}
                    onChange={(e) => handleDateChange('to', e.target.value)}
                    className="focus:ring-navy-500 focus:border-navy-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reference ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex justify-center items-center space-x-2">
                      <RefreshCwIcon className="h-5 w-5 animate-spin" />
                      <span>Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : displayTransactions.length > 0 ? (
                displayTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className={transaction.status === 'pending' ? 'bg-yellow-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.user ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-500">
                              {transaction.user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.user.name}
                            </div>
                            <div className="text-sm text-gray-500">{transaction.user.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">User not found</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(transaction.type)}
                        <span className="ml-1 text-sm text-gray-900 capitalize">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(transaction.amount, transaction.asset)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          transaction.status
                        )}`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.reference_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedTransaction(transaction.id)}
                        className="text-navy-600 hover:text-navy-900 mr-4"
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your filters or search criteria
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {displayTransactions.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * 10, transactionsData?.pagination?.total || 0)}
                </span>{' '}
                of <span className="font-medium">{transactionsData?.pagination?.total || 0}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ArrowUpIcon className="h-5 w-5 rotate-90" aria-hidden="true" />
                </button>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show current page, first, last, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                          ? 'z-10 bg-navy-500 border-navy-500 text-navy-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }

                  // Show ellipsis for gaps
                  if (
                    (pageNum === 2 && currentPage > 3) ||
                    (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={`ellipsis-${pageNum}`}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ArrowDownIcon className="h-5 w-5 rotate-90" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transactionId={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        >
          <TransactionDetail 
            transactionId={selectedTransaction} 
            onClose={() => setSelectedTransaction(null)} 
          />
        </TransactionDetailModal>
      )}
    </div>
  );
}

// Component to fetch and display transaction details
function TransactionDetail({ transactionId, onClose }: { transactionId: string, onClose: () => void }) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'view' | 'approve' | 'decline' | 'refund'>('view');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getTransaction(transactionId);
        setTransaction(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch transaction:', err);
        setError('Failed to load transaction details');
        toast.error('Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  if (loading) {
    return <div className="p-6 text-center">Loading transaction details...</div>;
  }

  if (error || !transaction) {
    return <div className="p-6 text-center text-red-500">{error || 'Transaction not found'}</div>;
  }

  // Check if transaction can be approved/declined (only pending transactions)
  const canApproveOrDecline = transaction.status === 'pending';
  
  // Check if transaction can be refunded (only approved deposits or withdrawals)
  const canRefund = 
    transaction.status === 'approved' && 
    (transaction.type === 'deposit' || transaction.type === 'withdrawal');

  return (
    <>
      {/* Action buttons */}
      {(canApproveOrDecline || canRefund) && (
        <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          <h3 className="w-full text-lg font-medium mb-2">Actions:</h3>
          {canApproveOrDecline && (
            <>
              <button
                onClick={() => setMode('approve')}
                className={`px-4 py-2 rounded-md ${mode === 'approve' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
              >
                Approve
              </button>
              <button
                onClick={() => setMode('decline')}
                className={`px-4 py-2 rounded-md ${mode === 'decline' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
              >
                Decline
              </button>
            </>
          )}
          {canRefund && (
            <button
              onClick={() => setMode('refund')}
              className={`px-4 py-2 rounded-md ${mode === 'refund' ? 'bg-yellow-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
              Refund
            </button>
          )}
          {mode !== 'view' && (
            <button
              onClick={() => setMode('view')}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Transaction form */}
      <TransactionForm
        transaction={transaction}
        mode={mode}
        onSuccess={() => {
          toast.success('Transaction updated successfully');
          onClose();
        }}
        onCancel={onClose}
      />
    </>
  );
}