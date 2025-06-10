'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { Transaction } from '@/lib/adminApi';
import {
  transactionUpdateSchema,
  refundSchema,
  TransactionUpdateData,
  RefundData,
  getValidationErrors,
} from '@/lib/validation/adminValidation';
import { useTransactionMutations } from '@/lib/hooks/useAdminData';

interface TransactionFormProps {
  transaction: Transaction;
  onSuccess?: () => void;
  onCancel?: () => void;
  mode: 'approve' | 'decline' | 'refund' | 'view';
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSuccess,
  onCancel,
  mode,
}) => {
  const { updateTransactionStatus, refundTransaction } = useTransactionMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reason, setReason] = useState('');

  const handleInputChange = (value: string) => {
    setReason(value);
    // Clear error when user starts typing
    if (errors.reason) {
      setErrors(prev => ({ ...prev, reason: '' }));
    }
  };

  const validateForm = () => {
    try {
      if (mode === 'refund') {
        refundSchema.parse({ reason });
      } else if (mode === 'decline' && !reason.trim()) {
        throw new z.ZodError([
          {
            code: 'custom',
            path: ['reason'],
            message: 'Reason is required when declining a transaction',
          },
        ]);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(getValidationErrors(error));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'refund') {
        await refundTransaction.mutateAsync({
          id: transaction.id,
          reason: reason.trim(),
        });
      } else if (mode === 'approve' || mode === 'decline') {
        await updateTransactionStatus.mutateAsync({
          id: transaction.id,
          status: mode === 'approve' ? 'approved' : 'declined',
          reason: reason.trim() || undefined,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Transaction action error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-blue-100 text-blue-800';
      case 'withdrawal':
        return 'bg-purple-100 text-purple-800';
      case 'trade':
        return 'bg-emerald-100 text-emerald-800';
      case 'subscription':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = () => {
    switch (mode) {
      case 'approve':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'decline':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'refund':
        return <ArrowPathIcon className="h-6 w-6 text-purple-500" />;
      default:
        return <CreditCardIcon className="h-6 w-6 text-emerald-500" />;
    }
  };

  const getActionTitle = () => {
    switch (mode) {
      case 'approve':
        return 'Approve Transaction';
      case 'decline':
        return 'Decline Transaction';
      case 'refund':
        return 'Refund Transaction';
      default:
        return 'Transaction Details';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number, asset: string) => {
    if (asset === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
    return `${amount.toLocaleString()} ${asset}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          {getActionIcon()}
          <span className="ml-2">{getActionTitle()}</span>
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Transaction Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Transaction ID:</span>
              <span className="ml-2 font-mono text-sm">{transaction.id}</span>
            </div>
            
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">User:</span>
              <span className="ml-2 text-sm">
                {transaction.user?.name || 'Unknown User'}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="ml-2 text-sm">
                {transaction.user?.email || 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Type:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(transaction.type)}`}>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="ml-2 font-semibold text-lg">
                {formatAmount(transaction.amount, transaction.asset)}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(transaction.status)}`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Created:</span>
              <span className="ml-2 text-sm">
                {formatDate(transaction.created_at)}
              </span>
            </div>
            
            {transaction.processed_at && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600">Processed:</span>
                <span className="ml-2 text-sm">
                  {formatDate(transaction.processed_at)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {transaction.reference_id && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">Reference ID:</span>
            <span className="ml-2 font-mono text-sm">{transaction.reference_id}</span>
          </div>
        )}
        
        {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600 block mb-2">Additional Information:</span>
            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
              {JSON.stringify(transaction.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Action Form */}
      {mode !== 'view' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'decline' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm font-medium text-red-800">
                  Declining this transaction
                </span>
              </div>
              <p className="text-sm text-red-700">
                Please provide a reason for declining this transaction. The user will be notified.
              </p>
            </div>
          )}
          
          {mode === 'refund' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ArrowPathIcon className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm font-medium text-purple-800">
                  Refunding this transaction
                </span>
              </div>
              <p className="text-sm text-purple-700">
                This will initiate a refund process. Please provide a reason for the refund.
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'refund' ? 'Refund Reason *' : 
               mode === 'decline' ? 'Decline Reason *' : 'Reason (Optional)'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => handleInputChange(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={`Enter ${mode === 'refund' ? 'refund' : mode === 'decline' ? 'decline' : ''} reason...`}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                mode === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : mode === 'decline'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              disabled={isSubmitting || updateTransactionStatus.isPending || refundTransaction.isPending}
            >
              {isSubmitting || updateTransactionStatus.isPending || refundTransaction.isPending
                ? `${mode === 'approve' ? 'Approving' : mode === 'decline' ? 'Declining' : 'Processing Refund'}...`
                : `${mode === 'approve' ? 'Approve' : mode === 'decline' ? 'Decline' : 'Process Refund'} Transaction`
              }
            </button>
          </div>
        </form>
      )}
      
      {mode === 'view' && onCancel && (
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionForm;