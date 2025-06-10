'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { 
  Cog6ToothIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  IdentificationIcon,
  BellIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  PencilSquareIcon,
  EyeIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  InformationCircleIcon,
  EyeSlashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import SettingsForm from '../components/forms/SettingsForm';

// Define types for settings data
interface Plan {
  id: string;
  name: string;
  duration: number; // in days
  roiMin: number;
  roiMax: number;
  minInvestment: number;
  maxInvestment: number;
  lockInPeriod: number; // in days
  isActive: boolean;
}

interface PaymentGateway {
  id: string;
  name: string;
  isActive: boolean;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  supportedCurrencies: string[];
}

interface KycRequirement {
  id: string;
  documentType: string;
  isRequired: boolean;
  description: string;
  allowedFileTypes: string[];
  maxFileSize: number; // in MB
}

interface NotificationTemplate {
  id: string;
  type: string;
  subject: string;
  emailBody: string;
  smsBody: string;
  variables: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}

export default function SettingsManagement() {
  const { user } = useUser();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'general' | 'plans' | 'payment' | 'kyc' | 'notifications' | 'roles' | 'audit'>('general');
  
  // State for general settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'MyBitFinance',
    logoUrl: '/logo.png',
    primaryEmail: 'support@mybitfinance.com',
    supportTelegram: '@mybitfinance_support',
    supportEmail: 'help@mybitfinance.com',
    maintenanceMode: false,
    darkModeDefault: false,
  });
  
  // State for plans
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'plan-1',
      name: 'Starter',
      duration: 30,
      roiMin: 3,
      roiMax: 5,
      minInvestment: 100,
      maxInvestment: 1000,
      lockInPeriod: 7,
      isActive: true,
    },
    {
      id: 'plan-2',
      name: 'Growth',
      duration: 90,
      roiMin: 5,
      roiMax: 8,
      minInvestment: 1000,
      maxInvestment: 10000,
      lockInPeriod: 15,
      isActive: true,
    },
    {
      id: 'plan-3',
      name: 'Premium',
      duration: 180,
      roiMin: 8,
      roiMax: 12,
      minInvestment: 10000,
      maxInvestment: 50000,
      lockInPeriod: 30,
      isActive: true,
    },
  ]);
  
  // State for payment gateways
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([
    {
      id: 'gateway-1',
      name: 'Stripe',
      isActive: true,
      apiKey: 'pk_test_51HZL...',
      secretKey: 'sk_test_51HZL...',
      webhookUrl: 'https://mybitfinance.com/api/webhooks/stripe',
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
    },
    {
      id: 'gateway-2',
      name: 'Coinbase Commerce',
      isActive: true,
      apiKey: 'cb_api_key...',
      secretKey: 'cb_secret_key...',
      webhookUrl: 'https://mybitfinance.com/api/webhooks/coinbase',
      supportedCurrencies: ['BTC', 'ETH', 'USDT', 'USDC'],
    },
  ]);
  
  // State for KYC requirements
  const [kycRequirements, setKycRequirements] = useState<KycRequirement[]>([
    {
      id: 'kyc-1',
      documentType: 'Government ID',
      isRequired: true,
      description: 'Passport, Driver\'s License, or National ID card',
      allowedFileTypes: ['jpg', 'png', 'pdf'],
      maxFileSize: 5,
    },
    {
      id: 'kyc-2',
      documentType: 'Proof of Address',
      isRequired: true,
      description: 'Utility bill or bank statement (not older than 3 months)',
      allowedFileTypes: ['jpg', 'png', 'pdf'],
      maxFileSize: 5,
    },
    {
      id: 'kyc-3',
      documentType: 'Selfie with ID',
      isRequired: true,
      description: 'A photo of yourself holding your ID document',
      allowedFileTypes: ['jpg', 'png'],
      maxFileSize: 5,
    },
  ]);
  
  // State for notification templates
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([
    {
      id: 'notif-1',
      type: 'Deposit Success',
      subject: 'Your deposit has been confirmed',
      emailBody: 'Dear {{userName}}, your deposit of {{amount}} {{currency}} has been confirmed and added to your account.',
      smsBody: 'MyBitFinance: Your deposit of {{amount}} {{currency}} has been confirmed.',
      variables: ['userName', 'amount', 'currency', 'transactionId'],
    },
    {
      id: 'notif-2',
      type: 'Withdrawal Approval',
      subject: 'Your withdrawal request has been approved',
      emailBody: 'Dear {{userName}}, your withdrawal request of {{amount}} {{currency}} has been approved and is being processed.',
      smsBody: 'MyBitFinance: Your withdrawal of {{amount}} {{currency}} has been approved.',
      variables: ['userName', 'amount', 'currency', 'transactionId'],
    },
    {
      id: 'notif-3',
      type: 'KYC Verification',
      subject: 'Your KYC verification status',
      emailBody: 'Dear {{userName}}, your KYC verification has been {{status}}. {{message}}',
      smsBody: 'MyBitFinance: Your KYC verification has been {{status}}.',
      variables: ['userName', 'status', 'message'],
    },
  ]);
  
  // State for roles and permissions
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'role-1',
      name: 'Super Admin',
      description: 'Full access to all modules',
      permissions: ['users.read', 'users.write', 'transactions.read', 'transactions.write', 'support.read', 'support.write', 'analytics.read', 'settings.read', 'settings.write'],
      userCount: 3,
    },
    {
      id: 'role-2',
      name: 'Moderator',
      description: 'Limited to Users and Support modules',
      permissions: ['users.read', 'users.write', 'support.read', 'support.write'],
      userCount: 5,
    },
    {
      id: 'role-3',
      name: 'Auditor',
      description: 'Read-only access to Users, Transactions, and Analytics',
      permissions: ['users.read', 'transactions.read', 'analytics.read'],
      userCount: 2,
    },
  ]);
  
  // State for audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      adminId: 'admin-1',
      adminName: 'John Admin',
      action: 'UPDATE',
      target: 'Plan: Premium',
      oldValue: 'maxInvestment: 25000',
      newValue: 'maxInvestment: 50000',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: 'log-2',
      adminId: 'admin-2',
      adminName: 'Sarah Manager',
      action: 'CREATE',
      target: 'Role: Support Agent',
      oldValue: '',
      newValue: 'permissions: ["support.read", "support.write"]',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 'log-3',
      adminId: 'admin-1',
      adminName: 'John Admin',
      action: 'UPDATE',
      target: 'Payment Gateway: Stripe',
      oldValue: 'isActive: false',
      newValue: 'isActive: true',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
  ]);
  
  // State for modals
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [isEditGatewayModalOpen, setIsEditGatewayModalOpen] = useState(false);
  const [isEditKycModalOpen, setIsEditKycModalOpen] = useState(false);
  const [isEditTemplateModalOpen, setIsEditTemplateModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  
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

  // Function to handle tab change
  const handleTabChange = (tab: 'general' | 'plans' | 'payment' | 'kyc' | 'notifications' | 'roles' | 'audit') => {
    setActiveTab(tab);
  };

  // Function to handle form submission
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to save the settings
    // For now, we'll just show a success message
    toast.success('Settings saved successfully!');
    
    // Add to audit log
    const newLog: AuditLog = {
      id: `log-${auditLogs.length + 1}`,
      adminId: user?.id || 'unknown',
      adminName: user?.fullName || 'Unknown User',
      action: 'UPDATE',
      target: `Settings: ${activeTab}`,
      oldValue: 'Previous settings',
      newValue: 'New settings',
      timestamp: new Date().toISOString(),
    };
    
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleEditSettings = () => {
    setShowForm(true);
  };

  const handleSaveSuccess = () => {
    setShowForm(false);
    
    // Add to audit log
    const newLog: AuditLog = {
      id: `log-${auditLogs.length + 1}`,
      adminId: user?.id || 'unknown',
      adminName: user?.fullName || 'Unknown User',
      action: 'UPDATE',
      target: `Settings: ${activeTab}`,
      oldValue: 'Previous settings',
      newValue: 'New settings',
      timestamp: new Date().toISOString(),
    };
    
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
  };

  // Function to toggle plan status
  const togglePlanStatus = (planId: string) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        return { ...plan, isActive: !plan.isActive };
      }
      return plan;
    }));
  };

  // Function to toggle gateway status
  const toggleGatewayStatus = (gatewayId: string) => {
    setPaymentGateways(paymentGateways.map(gateway => {
      if (gateway.id === gatewayId) {
        return { ...gateway, isActive: !gateway.isActive };
      }
      return gateway;
    }));
  };

  // Function to toggle KYC requirement
  const toggleKycRequirement = (kycId: string) => {
    setKycRequirements(kycRequirements.map(kyc => {
      if (kyc.id === kycId) {
        return { ...kyc, isRequired: !kyc.isRequired };
      }
      return kyc;
    }));
  };

  return (
    <div className="p-6">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Cog6ToothIcon className="h-6 w-6 mr-2 text-emerald-500" />
          System Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Configure platform settings, manage plans, payment gateways, and more.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Settings tabs">
          <button
            onClick={() => handleTabChange('general')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Cog6ToothIcon className="h-5 w-5 inline-block mr-2" />
            General
          </button>
          <button
            onClick={() => handleTabChange('plans')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'plans' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <BuildingLibraryIcon className="h-5 w-5 inline-block mr-2" />
            Plans & Rates
          </button>
          <button
            onClick={() => handleTabChange('payment')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payment' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <CreditCardIcon className="h-5 w-5 inline-block mr-2" />
            Payment Gateways
          </button>
          <button
            onClick={() => handleTabChange('kyc')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'kyc' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <IdentificationIcon className="h-5 w-5 inline-block mr-2" />
            KYC & Compliance
          </button>
          <button
            onClick={() => handleTabChange('notifications')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'notifications' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <BellIcon className="h-5 w-5 inline-block mr-2" />
            Notifications
          </button>
          <button
            onClick={() => handleTabChange('roles')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'roles' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <UserGroupIcon className="h-5 w-5 inline-block mr-2" />
            Roles & Permissions
          </button>
          <button
            onClick={() => handleTabChange('audit')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'audit' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <DocumentDuplicateIcon className="h-5 w-5 inline-block mr-2" />
            Audit Logs
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        {/* General Settings */}
        {activeTab === 'general' && (
          showForm ? (
            <SettingsForm
              settingType="general"
              onSuccess={handleSaveSuccess}
              onCancel={handleCancelEdit}
              initialData={{
                platformName: generalSettings.platformName,
                logoUrl: generalSettings.logoUrl,
                primaryEmail: generalSettings.primaryEmail,
                supportTelegram: generalSettings.supportTelegram,
                supportEmail: generalSettings.supportEmail,
                maintenanceMode: generalSettings.maintenanceMode,
                darkModeDefault: generalSettings.darkModeDefault,
              }}
            />
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Site Configuration</h3>
                  <button
                    onClick={handleEditSettings}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                  >
                    <PencilSquareIcon className="h-5 w-5 mr-1" />
                    Edit Settings
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Platform Name
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{generalSettings.platformName}</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Logo URL
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{generalSettings.logoUrl}</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Primary Email
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{generalSettings.primaryEmail}</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Support Telegram
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{generalSettings.supportTelegram}</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Support Email
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{generalSettings.supportEmail}</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Maintenance Mode
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {generalSettings.maintenanceMode ? 'Enabled' : 'Disabled'}
                    </p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Dark Mode Default
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {generalSettings.darkModeDefault ? 'Enabled' : 'Disabled'}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        )}

        {/* Plans & Rates */}
        {activeTab === 'plans' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Investment Plans</h2>
              <button
                onClick={() => {
                  setCurrentEditItem(null);
                  setIsEditPlanModalOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" />
                Add Plan
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI Range</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment Range</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lock-in Period</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans.map((plan, index) => (
                    <motion.tr 
                      key={plan.id}
                      variants={itemVariants}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.duration} days</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.roiMin}% - {plan.roiMax}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${plan.minInvestment} - ${plan.maxInvestment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.lockInPeriod} days</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => togglePlanStatus(plan.id)}
                            className={`p-1 rounded-full ${plan.isActive ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                            title={plan.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {plan.isActive ? <XCircleIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => {
                              setCurrentEditItem(plan);
                              setIsEditPlanModalOpen(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                            title="Edit"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this plan?')) {
                                setPlans(plans.filter(p => p.id !== plan.id));
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Payment Gateways */}
        {activeTab === 'payment' && (
          showForm ? (
            <SettingsForm
              settingType="payment"
              onSuccess={handleSaveSuccess}
              onCancel={handleCancelEdit}
              initialData={{
                name: 'Stripe Gateway',
                provider: 'stripe',
                api_key: 'sk_test_***',
                secret_key: 'sk_secret_***',
                webhook_url: 'https://mybitfinance.com/webhooks/stripe',
                enabled: true,
                test_mode: true,
              }}
            />
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Gateway Configuration</h3>
                  <button
                    onClick={handleEditSettings}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                  >
                    <PencilSquareIcon className="h-5 w-5 mr-1" />
                    Edit Settings
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Payment Gateways</h2>
                <button
                  onClick={() => {
                    setCurrentEditItem(null);
                    setIsEditGatewayModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-1" />
                  Add Gateway
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentGateways.map((gateway) => (
                  <motion.div 
                    key={gateway.id}
                    variants={itemVariants}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">{gateway.name}</h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gateway.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {gateway.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="px-6 py-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">API Key</p>
                        <div className="flex items-center">
                          <input 
                            type="password" 
                            value="••••••••••••••••" 
                            disabled 
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                          />
                          <button className="ml-2 p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Webhook URL</p>
                        <input 
                          type="text" 
                          value={gateway.webhookUrl} 
                          disabled 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                        />
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Supported Currencies</p>
                        <div className="flex flex-wrap gap-2">
                          {gateway.supportedCurrencies.map((currency) => (
                            <span key={currency} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                              {currency}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={() => toggleGatewayStatus(gateway.id)}
                          className={`px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${gateway.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500' : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'}`}
                        >
                          {gateway.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => {
                            setCurrentEditItem(gateway);
                            setIsEditGatewayModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this gateway?')) {
                              setPaymentGateways(paymentGateways.filter(g => g.id !== gateway.id));
                            }
                          }}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        )}

        {/* KYC & Compliance */}
        {activeTab === 'kyc' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">KYC Requirements</h2>
              <button
                onClick={() => {
                  setCurrentEditItem(null);
                  setIsEditKycModalOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" />
                Add Requirement
              </button>
            </div>
            
            <div className="space-y-4">
              {kycRequirements.map((requirement) => (
                <motion.div 
                  key={requirement.id}
                  variants={itemVariants}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{requirement.documentType}</h3>
                      <p className="text-sm text-gray-500 mt-1">{requirement.description}</p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${requirement.isRequired ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {requirement.isRequired ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Allowed File Types</p>
                      <div className="flex flex-wrap gap-2">
                        {requirement.allowedFileTypes.map((fileType) => (
                          <span key={fileType} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                            .{fileType}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Max File Size</p>
                      <p className="text-sm font-medium">{requirement.maxFileSize} MB</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => toggleKycRequirement(requirement.id)}
                      className={`px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${requirement.isRequired ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500'}`}
                    >
                      {requirement.isRequired ? 'Make Optional' : 'Make Required'}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentEditItem(requirement);
                        setIsEditKycModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this requirement?')) {
                          setKycRequirements(kycRequirements.filter(k => k.id !== requirement.id));
                        }
                      }}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Notification Templates */}
        {activeTab === 'notifications' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Notification Templates</h2>
              <button
                onClick={() => {
                  setCurrentEditItem(null);
                  setIsEditTemplateModalOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" />
                Add Template
              </button>
            </div>
            
            <div className="space-y-6">
              {notificationTemplates.map((template) => (
                <motion.div 
                  key={template.id}
                  variants={itemVariants}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">{template.type}</h3>
                    <p className="text-sm text-gray-500 mt-1">Subject: {template.subject}</p>
                  </div>
                  
                  <div className="px-6 py-4">
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Email Template</p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800 border border-gray-200">
                        {template.emailBody}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">SMS Template</p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800 border border-gray-200">
                        {template.smsBody}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Available Variables</p>
                      <div className="flex flex-wrap gap-2">
                        {template.variables.map((variable) => (
                          <span key={variable} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                            {`{{${variable}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => {
                          setCurrentEditItem(template);
                          setIsEditTemplateModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this template?')) {
                            setNotificationTemplates(notificationTemplates.filter(t => t.id !== template.id));
                          }
                        }}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Roles & Permissions */}
        {activeTab === 'roles' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Roles & Permissions</h2>
              <button
                onClick={() => {
                  setCurrentEditItem(null);
                  setIsEditRoleModalOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" />
                Add Role
              </button>
            </div>
            
            <div className="space-y-6">
              {roles.map((role) => (
                <motion.div 
                  key={role.id}
                  variants={itemVariants}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                      {role.userCount} users
                    </span>
                  </div>
                  
                  <div className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                          {permission}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-6">
                      <button
                        onClick={() => {
                          setCurrentEditItem(role);
                          setIsEditRoleModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this role?')) {
                            setRoles(roles.filter(r => r.id !== role.id));
                          }
                        }}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={role.userCount > 0}
                        title={role.userCount > 0 ? 'Cannot delete role with assigned users' : ''}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Audit Logs */}
        {activeTab === 'audit' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Audit Logs</h2>
              <div className="flex space-x-2">
                <select 
                  className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                >
                  <option value="all">All Actions</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                </select>
                <button
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
                  Export
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.map((log, index) => (
                    <motion.tr 
                      key={log.id}
                      variants={itemVariants}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.adminName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.action === 'CREATE' ? 'bg-green-100 text-green-800' : log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.target}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.oldValue && (
                          <div className="text-red-500 line-through mb-1">{log.oldValue}</div>
                        )}
                        {log.newValue && (
                          <div className="text-green-500">{log.newValue}</div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {auditLogs.length === 0 && (
              <div className="text-center py-8">
                <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No audit logs found</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Sticky Save Button for all tabs except Audit */}
      {activeTab !== 'audit' && (
        <motion.div 
          className="fixed bottom-6 right-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center"
          >
            <CheckIcon className="h-5 w-5 mr-1" />
            Save Changes
          </button>
        </motion.div>
      )}
    </div>
  );
}