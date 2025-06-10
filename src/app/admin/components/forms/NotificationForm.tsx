'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { AdminNotification } from '@/lib/adminApi';
import {
  notificationSchema,
  NotificationData,
  getValidationErrors,
} from '@/lib/validation/adminValidation';
import { useNotificationMutations } from '@/lib/hooks/useAdminData';

interface NotificationFormProps {
  notification?: AdminNotification;
  onSuccess?: () => void;
  onCancel?: () => void;
  mode: 'create' | 'view' | 'markRead';
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  notification,
  onSuccess,
  onCancel,
  mode,
}) => {
  const { markAsRead } = useNotificationMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<NotificationData>({
    title: notification?.title || '',
    message: notification?.message || '',
    type: notification?.type || 'info',
    priority: notification?.priority || 'medium',
  });

  const handleInputChange = (field: keyof NotificationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      notificationSchema.parse(formData);
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

    if (mode === 'markRead' && notification) {
      setIsSubmitting(true);
      try {
        await markAsRead.mutateAsync(notification.id);
        onSuccess?.();
      } catch (error) {
        console.error('Mark notification as read error:', error);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'create') {
      if (!validateForm()) {
        toast.error('Please fix the validation errors');
        return;
      }

      setIsSubmitting(true);
      try {
        // In a real implementation, you would call an API to create the notification
        // For now, we'll just show a success message
        toast.success('Notification created successfully');
        onSuccess?.();
      } catch (error) {
        console.error('Create notification error:', error);
        toast.error('Failed to create notification');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getFormTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create Notification';
      case 'markRead':
        return 'Mark as Read';
      default:
        return 'Notification Details';
    }
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
          <BellIcon className="h-6 w-6 mr-2 text-emerald-500" />
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

      {/* Notification Details (View Mode) */}
      {mode === 'view' && notification && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${getTypeColor(notification.type)}`}>
            <div className="flex items-start">
              {getTypeIcon(notification.type)}
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold">{notification.title}</h3>
                <p className="mt-2 text-sm">{notification.message}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-600">Priority:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                  {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-gray-600">Created:</span>
                <span className="ml-2">{formatDate(notification.created_at)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  notification.read ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {notification.read ? 'Read' : 'Unread'}
                </span>
              </div>
              
              {notification.read && notification.read_at && (
                <div className="flex items-center">
                  <span className="text-gray-600">Read at:</span>
                  <span className="ml-2">{formatDate(notification.read_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mark as Read Confirmation */}
      {mode === 'markRead' && notification && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Mark Notification as Read
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Are you sure you want to mark this notification as read? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{notification.title}</h4>
            <p className="text-sm text-gray-700">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Create Form */}
      {mode === 'create' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter notification title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter notification message"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.priority ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
              )}
            </div>
          </div>
        </form>
      )}
      
      {/* Action Buttons */}
      {mode !== 'view' && (
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
            onClick={handleSubmit}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center"
            disabled={isSubmitting || markAsRead.isPending}
          >
            {isSubmitting || markAsRead.isPending
              ? (mode === 'create' ? 'Creating...' : 'Marking as Read...')
              : (mode === 'create' ? 'Create Notification' : 'Mark as Read')
            }
          </button>
        </div>
      )}
      
      {mode === 'view' && onCancel && (
        <div className="flex justify-end pt-6 border-t border-gray-200">
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

export default NotificationForm;