'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminApi, {
  User,
  Transaction,
  SupportTicket,
  AdminNotification,
  DashboardMetrics,
  ApiResponse,
} from '../adminApi';

// Custom hook for dashboard metrics
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'metrics'],
    queryFn: () => adminApi.getDashboardMetrics(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
}

// Custom hook for users management
export function useUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  kycStatus?: string;
} = {}) {
  const [filters, setFilters] = useState(params);
  
  const query = useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminApi.getUsers(filters),
  });

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    ...query,
    filters,
    updateFilters,
  };
}

// Custom hook for single user
export function useUser(id: string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminApi.getUser(id),
    enabled: !!id,
  });
}

// Custom hook for user mutations
export function useUserMutations() {
  const queryClient = useQueryClient();

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      adminApi.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update the user in the cache
      queryClient.setQueryData(['admin', 'users', updatedUser.id], updatedUser);
      
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: ['admin', 'users', deletedId] });
      
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  return {
    updateUser,
    deleteUser,
  };
}

// Custom hook for transactions
export function useTransactions(params: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
} = {}) {
  const [filters, setFilters] = useState(params);
  
  const query = useQuery({
    queryKey: ['admin', 'transactions', filters],
    queryFn: () => adminApi.getTransactions(filters),
  });

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    ...query,
    filters,
    updateFilters,
  };
}

// Custom hook for transaction mutations
export function useTransactionMutations() {
  const queryClient = useQueryClient();

  const updateTransactionStatus = useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: 'approved' | 'declined';
      reason?: string;
    }) => adminApi.updateTransactionStatus(id, status, reason),
    onSuccess: (updatedTransaction) => {
      // Update transaction in cache
      queryClient.setQueryData(
        ['admin', 'transactions', updatedTransaction.id],
        updatedTransaction
      );
      
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
      
      // Invalidate dashboard metrics
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'metrics'] });
      
      toast.success(`Transaction ${updatedTransaction.status} successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update transaction: ${error.message}`);
    },
  });

  const refundTransaction = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.refundTransaction(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
      toast.success('Transaction refunded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to refund transaction: ${error.message}`);
    },
  });

  return {
    updateTransactionStatus,
    refundTransaction,
  };
}

// Custom hook for support tickets
export function useSupportTickets(params: {
  page?: number;
  limit?: number;
  status?: string;
  assignedTo?: string;
} = {}) {
  const [filters, setFilters] = useState(params);
  
  const query = useQuery({
    queryKey: ['admin', 'support', 'tickets', filters],
    queryFn: () => adminApi.getSupportTickets(filters),
  });

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    ...query,
    filters,
    updateFilters,
  };
}

// Custom hook for support ticket mutations
export function useSupportTicketMutations() {
  const queryClient = useQueryClient();

  const updateTicket = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status?: string; assigned_to?: string };
    }) => adminApi.updateSupportTicket(id, data),
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(
        ['admin', 'support', 'tickets', updatedTicket.id],
        updatedTicket
      );
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'tickets'] });
      toast.success('Ticket updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update ticket: ${error.message}`);
    },
  });

  const replyToTicket = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      adminApi.replyToTicket(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'tickets'] });
      toast.success('Reply sent successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send reply: ${error.message}`);
    },
  });

  return {
    updateTicket,
    replyToTicket,
  };
}

// Custom hook for notifications
export function useNotifications(params: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
} = {}) {
  const [filters, setFilters] = useState(params);
  
  const query = useQuery({
    queryKey: ['admin', 'notifications', filters],
    queryFn: () => adminApi.getNotifications(filters),
    refetchInterval: 30000, // Check for new notifications every 30 seconds
  });

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    ...query,
    filters,
    updateFilters,
  };
}

// Custom hook for notification mutations
export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const markAsRead = useMutation({
    mutationFn: (id: string) => adminApi.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark notification as read: ${error.message}`);
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => adminApi.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
      toast.success('All notifications marked as read');
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark all notifications as read: ${error.message}`);
    },
  });

  return {
    markAsRead,
    markAllAsRead,
  };
}

// Custom hook for analytics
export function useAnalytics(params: {
  range?: string;
  interval?: string;
} = {}) {
  const [filters, setFilters] = useState(params);
  
  const query = useQuery({
    queryKey: ['admin', 'analytics', filters],
    queryFn: () => adminApi.getAnalytics(filters),
  });

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    ...query,
    filters,
    updateFilters,
  };
}

// Loading state hook for multiple queries
export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await promise;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    withLoading,
    clearError: () => setError(null),
  };
}