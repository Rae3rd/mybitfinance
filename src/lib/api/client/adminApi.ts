'use client';

import {
  User,
  Transaction,
  SupportTicket,
  AdminNotification,
  DashboardMetrics,
  ApiResponse,
  ApiError
} from '../types';

/**
 * Client-side Admin API Client
 * 
 * IMPORTANT: This file should only be imported in client components.
 * For server components or API routes, use the server-side AdminApiService from @/lib/api/server/adminApi
 */

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class AdminApiClient {
  /**
   * Generic request method for API calls
   * Uses fetch with appropriate headers
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for auth
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
    search?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ApiResponse<Transaction[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && (typeof value === 'string' ? value !== '' : true)) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<Transaction[]>(`/admin/transactions?${queryParams.toString()}`);
  }

  async getTransaction(id: string): Promise<Transaction> {
    const response = await this.request<Transaction>(`/admin/transactions/${id}`);
    return response.data;
  }

  async updateTransactionStatus(id: string, status: 'approved' | 'declined', notes?: string): Promise<Transaction> {
    const response = await this.request<Transaction>(`/admin/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
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
    search?: string;
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

  async updateSupportTicket(id: string, data: { status?: string; assigned_to?: string }): Promise<SupportTicket> {
    const response = await this.request<SupportTicket>(`/admin/support/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async replySupportTicket(id: string, message: string): Promise<void> {
    await this.request(`/admin/support/tickets/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Chat APIs
  async getChatSessions(params: {
    page?: number;
    limit?: number;
    status?: string;
    assignedTo?: string;
    userId?: string;
  } = {}): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && (typeof value === 'string' ? value !== '' : true)) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<any[]>(`/admin/support/chats?${queryParams.toString()}`);
  }

  async getChatMessages(chatId: string, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<any[]>(`/admin/support/chats/${chatId}/messages?${queryParams.toString()}`);
  }

  async sendChatMessage(chatId: string, message: string): Promise<void> {
    await this.request(`/admin/support/chats/${chatId}/messages`, {
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
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<AdminNotification[]>(`/admin/notifications?${queryParams.toString()}`);
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.request(`/admin/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead(): Promise<void> {
    await this.request('/admin/notifications/read-all', {
      method: 'PATCH',
    });
  }
  
  async createNotification(data: {
    type: 'user_registration' | 'transaction_pending' | 'support_message' | 'system_alert';
    message: string;
    related_entity?: string;
    related_id?: string;
  }): Promise<ApiResponse<AdminNotification>> {
    return this.request<AdminNotification>('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Create and export a singleton instance
const adminApi = new AdminApiClient();
export default adminApi;