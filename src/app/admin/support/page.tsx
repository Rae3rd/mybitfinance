'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  UserCircleIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useSupportTickets, useSupportTicketMutations } from '@/lib/hooks/useAdminData';
import SupportTicketForm from '../components/forms/SupportTicketForm';
import ChatManagement from './components/ChatManagement';
import { TicketStatus } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800'
};

const statusIcons = {
  OPEN: <ClockIcon className="h-5 w-5" />,
  IN_PROGRESS: <UserCircleIcon className="h-5 w-5" />,
  RESOLVED: <CheckCircleIcon className="h-5 w-5" />,
  CLOSED: <XCircleIcon className="h-5 w-5" />
};

// Tab interface component
const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => setActiveTab('tickets')}
        className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'tickets' 
          ? 'border-emerald-500 text-emerald-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
      >
        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
        Support Tickets
      </button>
      <button
        onClick={() => setActiveTab('chat')}
        className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'chat' 
          ? 'border-emerald-500 text-emerald-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
      >
        <ChatBubbleOvalLeftIcon className="h-5 w-5 mr-2" />
        Live Chat
      </button>
    </div>
  );
};

export default function SupportManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('tickets');
  
  // Get query parameters for filtering and pagination
  const pageParam = searchParams.get('page');
  const statusParam = searchParams.get('status');
  const assignedToParam = searchParams.get('assignedTo');
  
  // State for filters and pagination
  const [filters, setFilters] = useState({
    status: statusParam || '',
    assignedTo: assignedToParam || '',
    page: pageParam ? parseInt(pageParam) : 1,
    limit: 10
  });
  
  // State for selected ticket
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Fetch tickets with the current filters
  const { 
    data: ticketsData, 
    isLoading, 
    isError, 
    error,
    updateFilters 
  } = useSupportTickets(filters);
  
  // Update URL when filters change
  useEffect(() => {
    if (activeTab !== 'tickets') return;
    
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.assignedTo) params.set('assignedTo', filters.assignedTo);
    if (filters.page > 1) params.set('page', filters.page.toString());
    
    const newUrl = `/admin/support${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  }, [filters, router, activeTab]);
  
  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // Reset to page 1 when changing filters
      page: name !== 'page' ? 1 : value
    }));
    updateFilters({
      ...filters,
      [name]: value,
      page: name !== 'page' ? 1 : value
    });
  };
  
  // Handle ticket selection
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
  };
  
  // Handle back to list
  const handleBackToList = () => {
    setSelectedTicket(null);
  };
  
  // Render loading state for tickets tab
  const renderTicketsLoading = () => (
    <div className="flex items-center justify-center h-64">
      <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg">Loading tickets...</span>
    </div>
  );
  
  // Render error state for tickets tab
  const renderTicketsError = () => (
    <div className="flex items-center justify-center h-64">
      <XCircleIcon className="h-8 w-8 text-red-500" />
      <span className="ml-2 text-lg text-red-500">
        Error loading tickets: {error?.message || 'Unknown error'}
      </span>
    </div>
  );
  
  // Render ticket detail view
  const renderTicketDetail = () => (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBackToList}
        className="flex items-center text-primary mb-6 hover:underline"
      >
        <ChevronLeftIcon className="h-5 w-5 mr-1" />
        Back to tickets
      </button>
      
      <SupportTicketForm 
        ticket={selectedTicket} 
        mode="reply" 
        onSuccess={() => {
          // Refresh the tickets list after successful reply
          updateFilters(filters);
        }}
        onCancel={handleBackToList}
      />
    </div>
  );
  
  // Render tickets list
  const renderTicketsList = () => (
    <>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-medium">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {Object.keys(TicketStatus).map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          {/* Assigned To filter - In a real app, you'd fetch admin users */}
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
          
          {/* Search - Not implemented in this version */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {ticketsData?.tickets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No tickets found matching your filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ticketsData?.tickets.map((ticket) => (
                    <motion.tr
                      key={ticket.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleSelectTicket(ticket)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{ticket.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.user?.name || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                          {statusIcons[ticket.status]}
                          <span className="ml-1">{ticket.status.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {ticketsData?.pagination && ticketsData.pagination.pages > 1 && (
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
                    <span className="font-medium">{ticketsData.pagination.pages}</span>
                  </p>
                  
                  <button
                    onClick={() => handleFilterChange('page', Math.min(ticketsData.pagination.pages, filters.page + 1))}
                    disabled={filters.page === ticketsData.pagination.pages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${filters.page === ticketsData.pagination.pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
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
    </>
  );
  
  // Render tickets tab content
  const renderTicketsTab = () => {
    if (isLoading) return renderTicketsLoading();
    if (isError) return renderTicketsError();
    if (selectedTicket) return renderTicketDetail();
    return renderTicketsList();
  };
  
  // Main render
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Support Management</h1>
      
      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Tab Content */}
      {activeTab === 'tickets' ? (
        renderTicketsTab()
      ) : (
        <ChatManagement />
      )}
    </div>
  );
}