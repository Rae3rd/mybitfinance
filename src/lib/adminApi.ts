import { auth } from '@clerk/nextjs/server';

// Types for admin API
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

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class AdminApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    try {
      const { userId, sessionClaims } = await auth();
      if (!userId) {
        throw new Error('Not authenticated');
      }
      
      // Extract role from sessionClaims metadata safely
      const role = sessionClaims?.metadata && typeof sessionClaims.metadata === 'object' 
        ? (sessionClaims.metadata as { role?: string }).role || 'user'
        : 'user';
        
      return {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
        'X-User-Role': role
      };
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dashboard APIs
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await this.request<DashboardMetrics>('/admin/dashboard/metrics');
    return response.data;
  }

  // Users APIs
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    kycStatus?: string;
  } = {}): Promise<ApiResponse<User[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && (typeof value === 'string' ? value !== '' : true)) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<User[]>(`/admin/users?${queryParams.toString()}`);
  }

  async getUser(id: string): Promise<User> {
    const response = await this.request<User>(`/admin/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await this.request<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Transactions APIs
  async getTransactions(params: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<ApiResponse<Transaction[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<Transaction[]>(`/admin/transactions?${queryParams.toString()}`);
  }

  async getTransaction(id: string): Promise<Transaction> {
    const response = await this.request<Transaction>(`/admin/transactions/${id}`);
    return response.data;
  }

  async updateTransactionStatus(
    id: string,
    status: 'approved' | 'declined',
    reason?: string
  ): Promise<Transaction> {
    const response = await this.request<Transaction>(`/admin/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
    return response.data;
  }

  async refundTransaction(id: string, reason: string): Promise<Transaction> {
    const response = await this.request<Transaction>(`/admin/transactions/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return response.data;
  }

  // Support APIs
  async getSupportTickets(params: {
    page?: number;
    limit?: number;
    status?: string;
    assignedTo?: string;
  } = {}): Promise<ApiResponse<SupportTicket[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && (typeof value === 'string' ? value !== '' : true)) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<SupportTicket[]>(`/admin/support/tickets?${queryParams.toString()}`);
  }

  async getSupportTicket(id: string): Promise<SupportTicket> {
    const response = await this.request<SupportTicket>(`/admin/support/tickets/${id}`);
    return response.data;
  }

  async updateSupportTicket(
    id: string,
    data: { status?: string; assigned_to?: string }
  ): Promise<SupportTicket> {
    const response = await this.request<SupportTicket>(`/admin/support/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async replyToTicket(id: string, message: string): Promise<void> {
    await this.request(`/admin/support/tickets/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Notifications APIs
  async getNotifications(params: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  } = {}): Promise<ApiResponse<AdminNotification[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && (typeof value === 'string' ? value !== '' : true)) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<AdminNotification[]>(`/admin/notifications?${queryParams.toString()}`);
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.request(`/admin/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.request('/admin/notifications/read-all', {
      method: 'PATCH',
    });
  }

  // Analytics APIs
  async getAnalytics(params: {
    range?: string;
    interval?: string;
  } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && (typeof value === 'string' ? value !== '' : true)) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await this.request(`/admin/analytics?${queryParams.toString()}`);
    return response.data;
  }
}

// Export singleton instance
export const adminApi = new AdminApiService();
export default adminApi;