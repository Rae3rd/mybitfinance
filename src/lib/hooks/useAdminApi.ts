'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/lib/api/client/adminApi';

/**
 * Custom hooks for admin API operations
 * These hooks use React Query for data fetching and caching
 */

/**
 * Hook for fetching dashboard metrics
 */
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'metrics'],
    queryFn: () => adminApi.getDashboardMetrics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching users with pagination and filtering
 */
export function useUsers(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminApi.getUsers(filters),
    keepPreviousData: true,
  });
}

/**
 * Hook for fetching a single user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminApi.getUser(id),
    enabled: !!id,
  });
}

/**
 * Hook for updating a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateUser(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['admin', 'users', variables.id]);
      queryClient.invalidateQueries(['admin', 'users']);
    },
  });
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['admin', 'users']);
    },
  });
}

/**
 * Hook for fetching transactions with pagination and filtering
 */
export function useTransactions(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'transactions', filters],
    queryFn: () => adminApi.getTransactions(filters),
    keepPreviousData: true,
  });
}

/**
 * Hook for fetching a single transaction by ID
 */
export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['admin', 'transactions', id],
    queryFn: () => adminApi.getTransaction(id),
    enabled: !!id,
  });
}

/**
 * Hook for updating a transaction status
 */
export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: 'approved' | 'declined'; notes?: string }) => 
      adminApi.updateTransactionStatus(id, status, notes),
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['admin', 'transactions', variables.id]);
      queryClient.invalidateQueries(['admin', 'transactions']);
      queryClient.invalidateQueries(['admin', 'dashboard', 'metrics']);
    },
  });
}

/**
 * Hook for fetching support tickets with pagination and filtering
 */
export function useSupportTickets(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'support', 'tickets', filters],
    queryFn: () => adminApi.getSupportTickets(filters),
    keepPreviousData: true,
  });
}

/**
 * Hook for fetching a single support ticket by ID
 */
export function useSupportTicket(id: string) {
  return useQuery({
    queryKey: ['admin', 'support', 'tickets', id],
    queryFn: () => adminApi.getSupportTicket(id),
    enabled: !!id,
  });
}

/**
 * Hook for updating a support ticket
 */
export function useUpdateSupportTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateSupportTicket(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['admin', 'support', 'tickets', variables.id]);
      queryClient.invalidateQueries(['admin', 'support', 'tickets']);
    },
  });
}

/**
 * Hook for replying to a support ticket
 */
export function useReplySupportTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => adminApi.replySupportTicket(id, message),
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['admin', 'support', 'tickets', variables.id]);
    },
  });
}

/**
 * Hook for fetching notifications with pagination and filtering
 */
export function useNotifications(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'notifications', filters],
    queryFn: () => adminApi.getNotifications(filters),
  });
}

/**
 * Hook for marking a notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApi.markNotificationRead(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['admin', 'notifications']);
    },
  });
}

/**
 * Hook for marking all notifications as read
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => adminApi.markAllNotificationsRead(),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['admin', 'notifications']);
    },
  });
}

/**
 * Hook for creating a new notification
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      type: 'user_registration' | 'transaction_pending' | 'support_message' | 'system_alert';
      message: string;
      related_entity?: string;
      related_id?: string;
    }) => adminApi.createNotification(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['admin', 'notifications']);
    },
  });
}