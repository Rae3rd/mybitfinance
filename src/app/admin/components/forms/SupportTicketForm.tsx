'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { SupportTicket } from '@/lib/adminApi';
import {
  ticketReplySchema,
  ticketUpdateSchema,
  TicketReplyData,
  TicketUpdateData,
  getValidationErrors,
} from '@/lib/validation/adminValidation';
import { useSupportTicketMutations } from '@/lib/hooks/useAdminData';

interface SupportTicketFormProps {
  ticket: SupportTicket;
  onSuccess?: () => void;
  onCancel?: () => void;
  mode: 'reply' | 'update' | 'view';
}

const SupportTicketForm: React.FC<SupportTicketFormProps> = ({
  ticket,
  onSuccess,
  onCancel,
  mode,
}) => {
  const { updateTicket, replyToTicket } = useSupportTicketMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [replyMessage, setReplyMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState(ticket.status);
  const [assignedTo, setAssignedTo] = useState(ticket.assigned_to || '');

  const handleReplyChange = (value: string) => {
    setReplyMessage(value);
    if (errors.message) {
      setErrors(prev => ({ ...prev, message: '' }));
    }
  };

  const validateForm = () => {
    try {
      if (mode === 'reply') {
        ticketReplySchema.parse({ message: replyMessage });
      } else if (mode === 'update') {
        ticketUpdateSchema.parse({
          status: ticketStatus,
          assigned_to: assignedTo || undefined,
        });
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
      if (mode === 'reply') {
        await replyToTicket.mutateAsync({
          id: ticket.id,
          message: replyMessage.trim(),
        });
        setReplyMessage(''); // Clear the reply after successful submission
      } else if (mode === 'update') {
        await updateTicket.mutateAsync({
          id: ticket.id,
          data: {
            status: ticketStatus,
            assigned_to: assignedTo || undefined,
          },
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Support ticket action error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'closed':
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getFormTitle = () => {
    switch (mode) {
      case 'reply':
        return 'Reply to Ticket';
      case 'update':
        return 'Update Ticket';
      default:
        return 'Ticket Details';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-emerald-500" />
          {getFormTitle()}
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

      {/* Ticket Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ticket Information</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusBadgeColor(ticket.status)}`}>
            {getStatusIcon(ticket.status)}
            <span className="ml-1">{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Ticket ID:</span>
              <span className="ml-2 font-mono text-sm">{ticket.id}</span>
            </div>
            
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">User:</span>
              <div className="ml-2">
                <div className="text-sm font-medium">{ticket.user?.name || 'Unknown User'}</div>
                <div className="text-xs text-gray-500">{ticket.user?.email || 'N/A'}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Created:</span>
              <span className="ml-2 text-sm">{formatDate(ticket.created_at)}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Last Updated:</span>
              <span className="ml-2 text-sm">{formatDate(ticket.updated_at)}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Assigned To:</span>
              <span className="ml-2 text-sm">
                {ticket.assigned_to || 'Unassigned'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Subject</h4>
          <p className="text-sm text-gray-700 mb-3">{ticket.subject}</p>
          
          <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
          <div className="bg-white p-3 rounded border text-sm text-gray-700 whitespace-pre-wrap">
            {ticket.message}
          </div>
        </div>
      </div>

      {/* Action Forms */}
      {mode !== 'view' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'update' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.assigned_to ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter admin username or email"
                />
                {errors.assigned_to && (
                  <p className="text-red-500 text-sm mt-1">{errors.assigned_to}</p>
                )}
              </div>
            </div>
          )}
          
          {mode === 'reply' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reply Message *
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => handleReplyChange(e.target.value)}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Type your reply to the user..."
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                This message will be sent to the user via email and displayed in their support dashboard.
              </p>
            </div>
          )}
          
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
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center"
              disabled={isSubmitting || updateTicket.isPending || replyToTicket.isPending}
            >
              {mode === 'reply' && <PaperAirplaneIcon className="h-4 w-4 mr-2" />}
              {isSubmitting || updateTicket.isPending || replyToTicket.isPending
                ? (mode === 'reply' ? 'Sending Reply...' : 'Updating...')
                : (mode === 'reply' ? 'Send Reply' : 'Update Ticket')
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

export default SupportTicketForm;