/**
 * Shared types for API responses and data models
 * These types can be used in both client and server code
 */

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin' | 'moderator' | 'auditor';
  kyc_status: 'verified' | 'pending' | 'rejected' | 'not_submitted';
  status: 'active' | 'inactive' | 'suspended';
  total_balance_usd: number;
  total_invested_usd: number;
  created_at: string;
  last_active_at: string;
  country?: string;
  phone?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'subscription';
  asset: 'USD' | 'BTC' | 'ETH' | 'USDT';
  amount: number;
  status: 'pending' | 'approved' | 'declined';
  created_at: string;
  processed_at?: string;
  reference_id: string;
  metadata?: Record<string, any>;
  user?: {
    name: string;
    email: string;
  };
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'pending' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface AdminNotification {
  id: string;
  type: 'user_registration' | 'transaction_pending' | 'support_message' | 'system_alert';
  message: string;
  related_entity?: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardMetrics {
  activeUsers: number;
  activeUsersChange: number;
  newRegistrations: number;
  newRegistrationsChange: number;
  pendingTransactions: number;
  pendingTransactionsChange: number;
  openTickets: number;
  openTicketsChange: number;
  systemHealth: {
    api: 'healthy' | 'warning' | 'error';
    database: 'healthy' | 'warning' | 'error';
    jobs: 'healthy' | 'warning' | 'error';
  };
  revenue: {
    today: number;
    todayChange: number;
    volume: number;
  };
  criticalAlerts: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}