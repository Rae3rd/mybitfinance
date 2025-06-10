'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  XCircleIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

// Types
interface ChatSession {
  id: string;
  user_id: string;
  status: 'ACTIVE' | 'CLOSED' | 'PENDING';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  is_admin: boolean;
  admin_id?: string;
  created_at: string;
  admin?: {
    name: string;
    email: string;
  };
}

interface ChatSessionsResponse {
  chats: ChatSession[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FilterState {
  status: string;
  assignedTo: string;
  page: number;
  limit: number;
  userId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API functions
async function getChatSessions({
  page = 1,
  limit = 10,
  status,
  assignedTo,
  userId,
  sortBy = 'created_at',
  sortOrder = 'desc',
}: {
  page?: number;
  limit?: number;
  status?: string;
  assignedTo?: string;
  userId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (status) params.append('status', status);
  if (assignedTo) params.append('assignedTo', assignedTo);
  if (userId) params.append('userId', userId);
  params.append('sortBy', sortBy);
  params.append('sortOrder', sortOrder);

  const response = await fetch(`/api/admin/support/chats?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch chat sessions');
  }
  return response.json();
}

async function getChatSession(id: string) {
  const response = await fetch(`/api/admin/support/chats/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch chat session');
  }
  return response.json();
}

async function updateChatSession(id: string, data: { status?: string; assigned_to?: string }) {
  const response = await fetch(`/api/admin/support/chats/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update chat session');
  }
  return response.json();
}

async function sendChatMessage(id: string, content: string) {
  const response = await fetch(`/api/admin/support/chats/${id}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
}

// Custom hooks
function useChatSessions(params: Partial<FilterState>) {
  const [filters, setFilters] = useState(params);
  
  const query = useQuery<ChatSessionsResponse, Error>({  
    queryKey: ['admin', 'support', 'chats', filters],
    queryFn: async () => {
      try {
        return await getChatSessions(filters as FilterState);
      } catch (err) {
        throw err instanceof Error ? err : new Error(String(err));
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    ...query,
    filters,
    updateFilters,
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null
  };
}

function useChatSession(id: string | null) {
  return useQuery<ChatSession, Error>({
    queryKey: ['admin', 'support', 'chats', id],
    queryFn: async () => {
      try {
        return await getChatSession(id as string);
      } catch (err) {
        throw err instanceof Error ? err : new Error(String(err));
      }
    },
    enabled: !!id,
    refetchInterval: id ? 5000 : false, // Refetch every 5 seconds when a chat is selected
  });
}

function useChatMutations() {
  const queryClient = useQueryClient();

  const updateChat = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { status?: string; assigned_to?: string } }) => {
      try {
        return await updateChatSession(id, data);
      } catch (err) {
        throw err instanceof Error ? err : new Error(String(err));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'chats'] });
      toast.success('Chat session updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update chat session: ${error.message}`);
    },
  });

  const sendMessage = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      try {
        return await sendChatMessage(id, content);
      } catch (err) {
        throw err instanceof Error ? err : new Error(String(err));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'chats'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });

  return {
    updateChat,
    sendMessage,
  };
}

// Status helpers
const statusColors: Record<ChatSession['status'], string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

// Main component
export default function ChatManagement() {
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    assignedTo: '',
    page: 1,
    limit: 10,
  });
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  
  const { data: chatsData, isLoading, isError, error } = useChatSessions(filters);
  const { data: selectedChat } = useChatSession(selectedChatId);
  const { updateChat, sendMessage } = useChatMutations();
  
  const handleFilterChange = (name: keyof FilterState, value: string | number) => {
    setFilters(prev => {
      const newFilters: FilterState = {
        ...prev,
        [name]: value,
      };
      
      if (name !== 'page') {
        newFilters.page = 1;
      }
      
      return newFilters;
    });
  };
  
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };
  
  const handleBackToList = () => {
    setSelectedChatId(null);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChatId || !messageInput.trim()) return;
    
    sendMessage.mutate(
      { id: selectedChatId, content: messageInput.trim() },
      {
        onSuccess: () => {
          setMessageInput('');
        },
      }
    );
  };
  
  const handleUpdateChatStatus = (status: string) => {
    if (!selectedChatId) return;
    
    updateChat.mutate({
      id: selectedChatId,
      data: { status },
    });
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading chat sessions...</span>
      </div>
    );
  }
  
  // Render error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <XCircleIcon className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-lg text-red-500">
          Error loading chat sessions: {error ? (error instanceof Error ? error.message : String(error)) : 'Unknown error'}
        </span>
      </div>
    );
  }
  
  // If a chat is selected, show the chat detail view
  if (selectedChatId && selectedChat) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBackToList}
          className="flex items-center text-primary mb-6 hover:underline"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Back to chat sessions
        </button>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserIcon className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedChat.user?.name || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedChat.user?.email || 'No email'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedChat.status]}`}>
                  {selectedChat.status}
                </span>
                
                <div className="relative">
                  <select
                    value={selectedChat.status}
                    onChange={(e) => handleUpdateChatStatus(e.target.value)}
                    className="border border-gray-300 rounded-md text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {selectedChat.messages && selectedChat.messages.length > 0 ? (
              selectedChat.messages.map((message: ChatMessage) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_admin ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.is_admin ? 'bg-emerald-100 text-emerald-900' : 'bg-gray-200 text-gray-900'}`}
                  >
                    <div className="text-xs mb-1">
                      {message.is_admin
                        ? `${message.admin?.name || 'Admin'} (${formatDistanceToNow(new Date(message.created_at), { addSuffix: true })})`
                        : `${selectedChat.user?.name || 'User'} (${formatDistanceToNow(new Date(message.created_at), { addSuffix: true })})`}
                    </div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No messages in this chat session yet.
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={selectedChat.status === 'CLOSED'}
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-r-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!messageInput.trim() || selectedChat.status === 'CLOSED' || sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5" />
                )}
              </button>
            </form>
            {selectedChat.status === 'CLOSED' && (
              <p className="text-xs text-red-500 mt-1">
                This chat session is closed. Reopen it to send messages.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Render chat sessions list
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Live Chat Management</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-medium">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          
          {/* Assigned To filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <select
              value={filters.assignedTo}
              onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Admins</option>
              <option value="admin1">Admin 1</option>
              <option value="admin2">Admin 2</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Chat Sessions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {!chatsData?.chats || chatsData.chats.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No chat sessions found matching your filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chatsData.chats.map((chat: ChatSession) => (
                    <motion.tr
                      key={chat.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleSelectChat(chat.id)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                            <UserIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {chat.user?.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {chat.user?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[chat.status]}`}>
                          {chat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {chat.messages && chat.messages[0] ? (
                          <div className="truncate max-w-xs">
                            {chat.messages[0].content}
                          </div>
                        ) : (
                          'No messages'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(chat.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {chat.assigned_to || 'Unassigned'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {chatsData.totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                    disabled={filters.page === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${filters.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    <ChevronLeftIcon className="h-5 w-5 mr-1" />
                    Previous
                  </button>
                  
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{filters.page}</span> of{' '}
                    <span className="font-medium">{chatsData.totalPages}</span>
                  </p>
                  
                  <button
                    onClick={() => handleFilterChange('page', Math.min(chatsData.totalPages, filters.page + 1))}
                    disabled={filters.page === chatsData.totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${filters.page === chatsData.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                    <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}