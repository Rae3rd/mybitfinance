'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  CogIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  generalSettingsSchema,
  paymentGatewaySchema,
  GeneralSettingsData,
  PaymentGatewayData,
  getValidationErrors,
} from '@/lib/validation/adminValidation';

interface SettingsFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
  settingType: 'general' | 'payment' | 'security' | 'notifications';
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  settingType,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState<GeneralSettingsData>({
    site_name: initialData?.site_name || 'MyBitFinance',
    site_description: initialData?.site_description || 'Professional Investment Platform',
    contact_email: initialData?.contact_email || 'support@mybitfinance.com',
    support_phone: initialData?.support_phone || '+1-555-0123',
    timezone: initialData?.timezone || 'UTC',
    currency: initialData?.currency || 'USD',
    maintenance_mode: initialData?.maintenance_mode || false,
  });
  
  // Payment Gateway State
  const [paymentSettings, setPaymentSettings] = useState<PaymentGatewayData>({
    name: initialData?.name || '',
    provider: initialData?.provider || 'stripe',
    api_key: initialData?.api_key || '',
    secret_key: initialData?.secret_key || '',
    webhook_url: initialData?.webhook_url || '',
    enabled: initialData?.enabled || false,
    test_mode: initialData?.test_mode || true,
  });
  
  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    two_factor_required: initialData?.two_factor_required || false,
    session_timeout: initialData?.session_timeout || 30,
    max_login_attempts: initialData?.max_login_attempts || 5,
    password_min_length: initialData?.password_min_length || 8,
    require_password_change: initialData?.require_password_change || false,
    ip_whitelist_enabled: initialData?.ip_whitelist_enabled || false,
    allowed_ips: initialData?.allowed_ips || '',
  });
  
  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: initialData?.email_notifications || true,
    sms_notifications: initialData?.sms_notifications || false,
    push_notifications: initialData?.push_notifications || true,
    transaction_alerts: initialData?.transaction_alerts || true,
    security_alerts: initialData?.security_alerts || true,
    marketing_emails: initialData?.marketing_emails || false,
    weekly_reports: initialData?.weekly_reports || true,
  });

  const handleGeneralSettingChange = (field: keyof GeneralSettingsData, value: string | boolean) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentSettingChange = (field: keyof PaymentGatewayData, value: string | boolean) => {
    setPaymentSettings(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSecuritySettingChange = (field: string, value: string | boolean | number) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNotificationSettingChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    try {
      if (settingType === 'general') {
        generalSettingsSchema.parse(generalSettings);
      } else if (settingType === 'payment') {
        paymentGatewaySchema.parse(paymentSettings);
      }
      // Security and notification settings don't have strict validation schemas yet
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
      // In a real implementation, you would call different APIs based on settingType
      let settingsData;
      switch (settingType) {
        case 'general':
          settingsData = generalSettings;
          break;
        case 'payment':
          settingsData = paymentSettings;
          break;
        case 'security':
          settingsData = securitySettings;
          break;
        case 'notifications':
          settingsData = notificationSettings;
          break;
        default:
          throw new Error('Invalid setting type');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${settingType.charAt(0).toUpperCase() + settingType.slice(1)} settings saved successfully`);
      onSuccess?.();
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormTitle = () => {
    switch (settingType) {
      case 'general':
        return 'General Settings';
      case 'payment':
        return 'Payment Gateway Settings';
      case 'security':
        return 'Security Settings';
      case 'notifications':
        return 'Notification Settings';
      default:
        return 'Settings';
    }
  };

  const getFormIcon = () => {
    switch (settingType) {
      case 'general':
        return <CogIcon className="h-6 w-6 mr-2 text-emerald-500" />;
      case 'payment':
        return <CreditCardIcon className="h-6 w-6 mr-2 text-emerald-500" />;
      case 'security':
        return <ShieldCheckIcon className="h-6 w-6 mr-2 text-emerald-500" />;
      case 'notifications':
        return <BellIcon className="h-6 w-6 mr-2 text-emerald-500" />;
      default:
        return <CogIcon className="h-6 w-6 mr-2 text-emerald-500" />;
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name *
          </label>
          <input
            type="text"
            value={generalSettings.site_name}
            onChange={(e) => handleGeneralSettingChange('site_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.site_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter site name"
          />
          {errors.site_name && (
            <p className="text-red-500 text-sm mt-1">{errors.site_name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email *
          </label>
          <input
            type="email"
            value={generalSettings.contact_email}
            onChange={(e) => handleGeneralSettingChange('contact_email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.contact_email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter contact email"
          />
          {errors.contact_email && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          value={generalSettings.site_description}
          onChange={(e) => handleGeneralSettingChange('site_description', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
            errors.site_description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter site description"
        />
        {errors.site_description && (
          <p className="text-red-500 text-sm mt-1">{errors.site_description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Phone
          </label>
          <input
            type="tel"
            value={generalSettings.support_phone}
            onChange={(e) => handleGeneralSettingChange('support_phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.support_phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter support phone"
          />
          {errors.support_phone && (
            <p className="text-red-500 text-sm mt-1">{errors.support_phone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone *
          </label>
          <select
            value={generalSettings.timezone}
            onChange={(e) => handleGeneralSettingChange('timezone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.timezone ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
          {errors.timezone && (
            <p className="text-red-500 text-sm mt-1">{errors.timezone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency *
          </label>
          <select
            value={generalSettings.currency}
            onChange={(e) => handleGeneralSettingChange('currency', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.currency ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
          </select>
          {errors.currency && (
            <p className="text-red-500 text-sm mt-1">{errors.currency}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenance_mode"
          checked={generalSettings.maintenance_mode}
          onChange={(e) => handleGeneralSettingChange('maintenance_mode', e.target.checked)}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
        <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-900">
          Enable Maintenance Mode
        </label>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gateway Name *
          </label>
          <input
            type="text"
            value={paymentSettings.name}
            onChange={(e) => handlePaymentSettingChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter gateway name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provider *
          </label>
          <select
            value={paymentSettings.provider}
            onChange={(e) => handlePaymentSettingChange('provider', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.provider ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="square">Square</option>
            <option value="razorpay">Razorpay</option>
          </select>
          {errors.provider && (
            <p className="text-red-500 text-sm mt-1">{errors.provider}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Key *
          </label>
          <input
            type="password"
            value={paymentSettings.api_key}
            onChange={(e) => handlePaymentSettingChange('api_key', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.api_key ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter API key"
          />
          {errors.api_key && (
            <p className="text-red-500 text-sm mt-1">{errors.api_key}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secret Key *
          </label>
          <input
            type="password"
            value={paymentSettings.secret_key}
            onChange={(e) => handlePaymentSettingChange('secret_key', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.secret_key ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter secret key"
          />
          {errors.secret_key && (
            <p className="text-red-500 text-sm mt-1">{errors.secret_key}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Webhook URL
        </label>
        <input
          type="url"
          value={paymentSettings.webhook_url}
          onChange={(e) => handlePaymentSettingChange('webhook_url', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
            errors.webhook_url ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter webhook URL"
        />
        {errors.webhook_url && (
          <p className="text-red-500 text-sm mt-1">{errors.webhook_url}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enabled"
            checked={paymentSettings.enabled}
            onChange={(e) => handlePaymentSettingChange('enabled', e.target.checked)}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
            Enable Gateway
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="test_mode"
            checked={paymentSettings.test_mode}
            onChange={(e) => handlePaymentSettingChange('test_mode', e.target.checked)}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="test_mode" className="ml-2 block text-sm text-gray-900">
            Test Mode
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={securitySettings.session_timeout}
            onChange={(e) => handleSecuritySettingChange('session_timeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            min="5"
            max="480"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={securitySettings.max_login_attempts}
            onChange={(e) => handleSecuritySettingChange('max_login_attempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            min="3"
            max="10"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Password Length
        </label>
        <input
          type="number"
          value={securitySettings.password_min_length}
          onChange={(e) => handleSecuritySettingChange('password_min_length', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          min="6"
          max="32"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="two_factor_required"
            checked={securitySettings.two_factor_required}
            onChange={(e) => handleSecuritySettingChange('two_factor_required', e.target.checked)}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="two_factor_required" className="ml-2 block text-sm text-gray-900">
            Require Two-Factor Authentication
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="require_password_change"
            checked={securitySettings.require_password_change}
            onChange={(e) => handleSecuritySettingChange('require_password_change', e.target.checked)}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="require_password_change" className="ml-2 block text-sm text-gray-900">
            Require Password Change on First Login
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="ip_whitelist_enabled"
            checked={securitySettings.ip_whitelist_enabled}
            onChange={(e) => handleSecuritySettingChange('ip_whitelist_enabled', e.target.checked)}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="ip_whitelist_enabled" className="ml-2 block text-sm text-gray-900">
            Enable IP Whitelist
          </label>
        </div>
      </div>
      
      {securitySettings.ip_whitelist_enabled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allowed IP Addresses (comma-separated)
          </label>
          <textarea
            value={securitySettings.allowed_ips}
            onChange={(e) => handleSecuritySettingChange('allowed_ips', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            placeholder="192.168.1.1, 10.0.0.1, 203.0.113.0/24"
          />
        </div>
      )}
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email_notifications"
              checked={notificationSettings.email_notifications}
              onChange={(e) => handleNotificationSettingChange('email_notifications', e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="email_notifications" className="ml-2 block text-sm text-gray-900">
              Enable Email Notifications
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="transaction_alerts"
              checked={notificationSettings.transaction_alerts}
              onChange={(e) => handleNotificationSettingChange('transaction_alerts', e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="transaction_alerts" className="ml-2 block text-sm text-gray-900">
              Transaction Alerts
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="security_alerts"
              checked={notificationSettings.security_alerts}
              onChange={(e) => handleNotificationSettingChange('security_alerts', e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="security_alerts" className="ml-2 block text-sm text-gray-900">
              Security Alerts
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="weekly_reports"
              checked={notificationSettings.weekly_reports}
              onChange={(e) => handleNotificationSettingChange('weekly_reports', e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="weekly_reports" className="ml-2 block text-sm text-gray-900">
              Weekly Reports
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="marketing_emails"
              checked={notificationSettings.marketing_emails}
              onChange={(e) => handleNotificationSettingChange('marketing_emails', e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="marketing_emails" className="ml-2 block text-sm text-gray-900">
              Marketing Emails
            </label>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Other Notifications</h3>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sms_notifications"
              checked={notificationSettings.sms_notifications}
              onChange={(e) => handleNotificationSettingChange('sms_notifications', e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="sms_notifications" className="ml-2 block text-sm text-gray-900">
              SMS Notifications
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="push_notifications"
              checked={notificationSettings.push_notifications}
              onChange={(e) => handleNotificationSettingChange('push_notifications', e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="push_notifications" className="ml-2 block text-sm text-gray-900">
              Push Notifications
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFormContent = () => {
    switch (settingType) {
      case 'general':
        return renderGeneralSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      default:
        return null;
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
          {getFormIcon()}
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

      <form onSubmit={handleSubmit}>
        {renderFormContent()}
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-8">
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SettingsForm;