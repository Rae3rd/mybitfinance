'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SupportManagement() {
  // State for search, filters, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' or 'chat'
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Mock ticket data
  const mockTickets = [
    {
      id: 'TKT-1234',
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      subject: 'Withdrawal not received',
      message: 'I made a withdrawal 3 days ago but it hasn\'t arrived in my bank account yet. Transaction ID: TX123456789',
      status: 'open',
      priority: 'high',
      assignedTo: null,
      createdAt: '2023-06-10T14:30:00',
      updatedAt: '2023-06-10T14:30:00',
      replies: []
    },
    {
      id: 'TKT-1235',
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      subject: 'KYC verification issue',
      message: 'I submitted my KYC documents 5 days ago but my status is still showing as pending. Can you please check?',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'Admin User',
      createdAt: '2023-06-09T10:15:00',
      updatedAt: '2023-06-09T16:45:00',
      replies: [
        {
          id: 'RPL-1',
          from: 'admin',
          adminName: 'Admin User',
          message: 'I\'ve checked your KYC submission and there seems to be an issue with the document clarity. Could you please resubmit a clearer copy of your ID?',
          createdAt: '2023-06-09T16:45:00'
        }
      ]
    },
    {
      id: 'TKT-1236',
      userId: '3',
      userName: 'Robert Johnson',
      userEmail: 'robert.johnson@example.com',
      subject: 'Account access problem',
      message: 'I\'m unable to log in to my account. I\'ve tried resetting my password but I\'m not receiving the reset email.',
      status: 'open',
      priority: 'high',
      assignedTo: null,
      createdAt: '2023-06-08T09:30:00',
      updatedAt: '2023-06-08T09:30:00',
      replies: []
    },
    {
      id: 'TKT-1237',
      userId: '4',
      userName: 'Emily Davis',
      userEmail: 'emily.davis@example.com',
      subject: 'Question about investment plans',
      message: 'I\'m interested in your premium investment plan but I have some questions about the fees and expected returns.',
      status: 'closed',
      priority: 'low',
      assignedTo: 'Support Team',
      createdAt: '2023-06-07T11:20:00',
      updatedAt: '2023-06-07T15:45:00',
      replies: [
        {
          id: 'RPL-2',
          from: 'admin',
          adminName: 'Support Team',
          message: 'Thank you for your interest in our premium plan. The annual fee is 1.5% and the expected returns range from 8-12% based on market conditions. Would you like me to send you our detailed brochure?',
          createdAt: '2023-06-07T13:30:00'
        },
        {
          id: 'RPL-3',
          from: 'user',
          userName: 'Emily Davis',
          message: 'Yes, please send me the brochure. Also, is there a minimum investment amount?',
          createdAt: '2023-06-07T14:15:00'
        },
        {
          id: 'RPL-4',
          from: 'admin',
          adminName: 'Support Team',
          message: 'I\'ve sent the brochure to your email. The minimum investment for the premium plan is $10,000. Let me know if you have any other questions!',
          createdAt: '2023-06-07T15:45:00'
        }
      ]
    },
    {
      id: 'TKT-1238',
      userId: '5',
      userName: 'Michael Wilson',
      userEmail: 'michael.wilson@example.com',
      subject: 'Incorrect transaction amount',
      message: 'I made a deposit of $5,000 but my account is only showing $4,500. Please check and correct this issue.',
      status: 'pending',
      priority: 'high',
      assignedTo: 'Finance Team',
      createdAt: '2023-06-06T16:10:00',
      updatedAt: '2023-06-06T17:30:00',
      replies: [
        {
          id: 'RPL-5',
          from: 'admin',
          adminName: 'Finance Team',
          message: 'We\'re investigating this discrepancy and will get back to you shortly with more information.',
          createdAt: '2023-06-06T17:30:00'
        }
      ]
    },
  ];

  // Mock chat sessions
  const mockChatSessions = [
    {
      id: 'CHAT-1',
      userId: '6',
      userName: 'Sarah Brown',
      userEmail: 'sarah.brown@example.com',
      status: 'active',
      lastActive: '2023-06-10T16:45:00',
      messages: [
        {
          id: 'MSG-1',
          from: 'user',
          message: 'Hello, I need help with setting up my portfolio.',
          timestamp: '2023-06-10T16:40:00'
        },
        {
          id: 'MSG-2',
          from: 'admin',
          adminName: 'Support Team',
          message: 'Hi Sarah, I\'d be happy to help you set up your portfolio. What kind of assets are you interested in?',
          timestamp: '2023-06-10T16:42:00'
        },
        {
          id: 'MSG-3',
          from: 'user',
          message: 'I\'m mainly interested in cryptocurrencies and some stocks.',
          timestamp: '2023-06-10T16:45:00'
        }
      ]
    },
    {
      id: 'CHAT-2',
      userId: '7',
      userName: 'David Lee',
      userEmail: 'david.lee@example.com',
      status: 'active',
      lastActive: '2023-06-10T16:30:00',
      messages: [
        {
          id: 'MSG-4',
          from: 'user',
          message: 'I\'m having trouble connecting my bank account.',
          timestamp: '2023-06-10T16:25:00'
        },
        {
          id: 'MSG-5',
          from: 'admin',
          adminName: 'Support Team',
          message: 'I\'m sorry to hear that, David. What error message are you seeing?',
          timestamp: '2023-06-10T16:27:00'
        },
        {
          id: 'MSG-6',
          from: 'user',
          message: 'It says "Connection failed: Unable to verify account ownership"',
          timestamp: '2023-06-10T16:30:00'
        }
      ]
    },
    {
      id: 'CHAT-3',
      userId: '8',
      userName: 'Lisa Taylor',
      userEmail: 'lisa.taylor@example.com',
      status: 'idle',
      lastActive: '2023-06-10T15:50:00',
      messages: [
        {
          id: 'MSG-7',
          from: 'user',
          message: 'What are the fees for withdrawals?',
          timestamp: '2023-06-10T15:45:00'
        },
        {
          id: 'MSG-8',
          from: 'admin',
          adminName: 'Support Team',
          message: 'Our withdrawal fee is 0.5% with a minimum of $2 and a maximum of $50. International wire transfers may have additional fees from intermediary banks.',
          timestamp: '2023-06-10T15:48:00'
        },
        {
          id: 'MSG-9',
          from: 'user',
          message: 'Thank you for the information.',
          timestamp: '2023-06-10T15:50:00'
        }
      ]
    }
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

  // Filter tickets based on search query and filter status
  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      ticket.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Get selected ticket details
  const selectedTicketDetails = selectedTicket 
    ? mockTickets.find(ticket => ticket.id === selectedTicket)
    : null;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle filter change
  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Simulate loading data
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Handle ticket selection
  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicket(ticketId);
  };

  // Handle reply submission
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketDetails) return;
    
    // In a real app, this would send the reply to the API
    console.log(`Replying to ticket ${selectedTicketDetails.id}: ${replyText}`);
    
    // Reset the reply text
    setReplyText('');
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-amber-100 text-amber-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge styling
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          Support Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage support tickets and live chat sessions with users.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex border-b border-gray-200">
          <button
            className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'tickets' ? 'text-navy-600 border-b-2 border-navy-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('tickets')}
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Support Tickets
          </button>
          <button
            className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'chat' ? 'text-navy-600 border-b-2 border-navy-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('chat')}
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
            Live Chat
          </button>
        </div>
      </motion.div>

      {/* Tickets View */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tickets List */}
          <div className="lg:col-span-1">
            {/* Search and Filters */}
            <motion.div 
              className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    placeholder="Search tickets..."
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
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleFilterChange('all')}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'all' ? 'bg-navy-100 text-navy-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      All Tickets
                    </button>
                    <button 
                      onClick={() => handleFilterChange('open')}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      Open
                    </button>
                    <button 
                      onClick={() => handleFilterChange('pending')}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'pending' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => handleFilterChange('closed')}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'closed' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      Closed
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Tickets List */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Support Tickets</h2>
                <p className="text-sm text-gray-500 mt-1">{filteredTickets.length} tickets found</p>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <motion.div 
                      key={ticket.id}
                      variants={itemVariants}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicket === ticket.id ? 'bg-gray-50' : ''}`}
                      onClick={() => handleTicketSelect(ticket.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{ticket.subject}</h3>
                          <p className="text-xs text-gray-500 mt-1">{ticket.userName} • {formatRelativeTime(ticket.updatedAt)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityBadgeClass(ticket.priority)}`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{ticket.message}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <ExclamationTriangleIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">No tickets found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Ticket Details */}
          <div className="lg:col-span-2">
            {selectedTicketDetails ? (
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Ticket Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedTicketDetails.subject}</h2>
                      <div className="flex items-center mt-2">
                        <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-navy-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                          {selectedTicketDetails.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">{selectedTicketDetails.userName}</p>
                          <p className="text-xs text-gray-500">{selectedTicketDetails.userEmail}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex space-x-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClass(selectedTicketDetails.status)}`}>
                          {selectedTicketDetails.status.charAt(0).toUpperCase() + selectedTicketDetails.status.slice(1)}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityBadgeClass(selectedTicketDetails.priority)}`}>
                          {selectedTicketDetails.priority.charAt(0).toUpperCase() + selectedTicketDetails.priority.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Ticket ID: {selectedTicketDetails.id}</p>
                      <p className="text-xs text-gray-500">Created: {formatDate(selectedTicketDetails.createdAt)}</p>
                    </div>
                  </div>
                  
                  {/* Ticket Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <select 
                      className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      value={selectedTicketDetails.status}
                    >
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="closed">Closed</option>
                    </select>
                    
                    <select 
                      className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      value={selectedTicketDetails.priority}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    
                    <button className="px-3 py-2 text-sm font-medium rounded-lg bg-navy-50 text-navy-700 hover:bg-navy-100 transition-colors">
                      Assign to Me
                    </button>
                    
                    <button className="px-3 py-2 text-sm font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                      View User Profile
                    </button>
                  </div>
                </div>
                
                {/* Conversation Thread */}
                <div className="p-6 max-h-[400px] overflow-y-auto">
                  {/* Initial Message */}
                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-navy-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        {selectedTicketDetails.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3 bg-gray-50 rounded-lg p-4 max-w-[80%]">
                        <p className="text-sm text-gray-900">{selectedTicketDetails.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(selectedTicketDetails.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Replies */}
                  {selectedTicketDetails.replies.map((reply) => (
                    <div key={reply.id} className="mb-6">
                      {reply.from === 'admin' ? (
                        <div className="flex items-start justify-end">
                          <div className="mr-3 bg-navy-50 rounded-lg p-4 max-w-[80%]">
                            <p className="text-sm text-gray-900">{reply.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(reply.createdAt)}</p>
                          </div>
                          <div className="flex-shrink-0 h-8 w-8 bg-navy-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                            {reply.adminName?.split(' ').map(n => n[0]).join('') || 'A'}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-navy-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium text-xs mr-2">
                            {reply.userName?.split(' ').map(n => n[0]).join('') || 'U'}
                          </div>
                          <div className="ml-3 bg-gray-50 rounded-lg p-4 max-w-[80%]">
                            <p className="text-sm text-gray-900">{reply.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(reply.createdAt)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Reply Form */}
                <div className="p-6 border-t border-gray-100">
                  <form onSubmit={handleReplySubmit}>
                    <div className="mb-4">
                      <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-1">Your Reply</label>
                      <textarea
                        id="reply"
                        rows={4}
                        className="block w-full rounded-lg border border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        placeholder="Type your reply here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          Save as Draft
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          Use Template
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                        Send Reply
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex items-center justify-center p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <EnvelopeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Select a ticket</h3>
                  <p className="text-sm text-gray-500 mt-1">Choose a ticket from the list to view details</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Live Chat View */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chat Sessions List */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Active Chat Sessions</h2>
                <p className="text-sm text-gray-500 mt-1">{mockChatSessions.length} active sessions</p>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {mockChatSessions.map((session) => (
                  <motion.div 
                    key={session.id}
                    variants={itemVariants}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-navy-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                          {session.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900">{session.userName}</h3>
                          <p className="text-xs text-gray-500">{session.userEmail}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${session.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                          <span className={`h-2 w-2 rounded-full mr-1 ${session.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(session.lastActive)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                      {session.messages[session.messages.length - 1].message}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-navy-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                    {mockChatSessions[0].userName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{mockChatSessions[0].userName}</h3>
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1"></span>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <UserCircleIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-100 transition-colors">
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-grow p-4 overflow-y-auto">
                {mockChatSessions[0].messages.map((message, index) => (
                  <div key={message.id} className={`mb-4 flex ${message.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    {message.from !== 'admin' && (
                      <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-navy-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium text-xs mr-2">
                        {mockChatSessions[0].userName.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className={`max-w-[70%] rounded-lg p-3 ${message.from === 'admin' ? 'bg-navy-50 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(message.timestamp)}</p>
                    </div>
                    {message.from === 'admin' && (
                      <div className="flex-shrink-0 h-8 w-8 bg-navy-600 rounded-full flex items-center justify-center text-white font-medium text-xs ml-2">
                        {message.adminName?.split(' ').map(n => n[0]).join('') || 'A'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Chat Input */}
              <div className="p-4 border-t border-gray-100">
                <form className="flex items-center">
                  <input
                    type="text"
                    className="flex-grow rounded-lg border border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm mr-2"
                    placeholder="Type your message..."
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Send
                  </button>
                </form>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>User is typing...</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}