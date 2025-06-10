import { z } from 'zod';

// User validation schemas
export const userUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['user', 'admin', 'moderator', 'auditor'], {
    errorMap: () => ({ message: 'Invalid role selected' })
  }),
  kyc_status: z.enum(['verified', 'pending', 'rejected', 'not_submitted'], {
    errorMap: () => ({ message: 'Invalid KYC status' })
  }),
  status: z.enum(['active', 'inactive', 'suspended'], {
    errorMap: () => ({ message: 'Invalid user status' })
  }),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export const userCreateSchema = userUpdateSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

// Transaction validation schemas
export const transactionUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'declined'], {
    errorMap: () => ({ message: 'Invalid transaction status' })
  }),
  reason: z.string().optional(),
});

export const refundSchema = z.object({
  reason: z.string().min(1, 'Refund reason is required').max(500, 'Reason must be less than 500 characters'),
});

// Support ticket validation schemas
export const ticketUpdateSchema = z.object({
  status: z.enum(['open', 'pending', 'closed'], {
    errorMap: () => ({ message: 'Invalid ticket status' })
  }),
  assigned_to: z.string().optional(),
});

export const ticketReplySchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters'),
});

export const ticketCreateSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters'),
  user_id: z.string().min(1, 'User ID is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

// Investment plan validation schemas
export const planCreateSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(100, 'Plan name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  min_investment: z.number().min(1, 'Minimum investment must be at least $1'),
  max_investment: z.number().min(1, 'Maximum investment must be at least $1'),
  duration_days: z.number().min(1, 'Duration must be at least 1 day').max(3650, 'Duration cannot exceed 10 years'),
  roi_percentage: z.number().min(0.1, 'ROI must be at least 0.1%').max(1000, 'ROI cannot exceed 1000%'),
  risk_level: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Invalid risk level' })
  }),
  is_active: z.boolean().default(true),
}).refine((data) => data.max_investment >= data.min_investment, {
  message: 'Maximum investment must be greater than or equal to minimum investment',
  path: ['max_investment'],
});

export const planUpdateSchema = planCreateSchema.partial();

// Settings validation schemas
export const generalSettingsSchema = z.object({
  platform_name: z.string().min(1, 'Platform name is required').max(100, 'Platform name must be less than 100 characters'),
  support_email: z.string().email('Invalid email address'),
  support_phone: z.string().optional(),
  telegram_link: z.string().url('Invalid Telegram URL').optional().or(z.literal('')),
  maintenance_mode: z.boolean().default(false),
  registration_enabled: z.boolean().default(true),
});

export const paymentGatewaySchema = z.object({
  name: z.string().min(1, 'Gateway name is required'),
  type: z.enum(['stripe', 'coinbase', 'bank_transfer', 'paypal'], {
    errorMap: () => ({ message: 'Invalid gateway type' })
  }),
  api_key: z.string().min(1, 'API key is required'),
  secret_key: z.string().min(1, 'Secret key is required'),
  webhook_url: z.string().url('Invalid webhook URL').optional(),
  is_active: z.boolean().default(true),
  test_mode: z.boolean().default(false),
});

// Notification validation schemas
export const notificationCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  message: z.string().min(1, 'Message is required').max(500, 'Message must be less than 500 characters'),
  type: z.enum(['info', 'warning', 'error', 'success'], {
    errorMap: () => ({ message: 'Invalid notification type' })
  }),
  target_users: z.array(z.string()).optional(), // Array of user IDs
  broadcast_to_all: z.boolean().default(false),
  scheduled_at: z.string().datetime().optional(),
});

// Analytics filter validation
export const analyticsFilterSchema = z.object({
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  interval: z.enum(['hour', 'day', 'week', 'month'], {
    errorMap: () => ({ message: 'Invalid interval' })
  }).optional(),
  metric_type: z.enum(['users', 'transactions', 'revenue', 'plans'], {
    errorMap: () => ({ message: 'Invalid metric type' })
  }).optional(),
});

// Bulk operations validation
export const bulkUserActionSchema = z.object({
  user_ids: z.array(z.string()).min(1, 'At least one user must be selected'),
  action: z.enum(['activate', 'deactivate', 'suspend', 'delete', 'send_notification'], {
    errorMap: () => ({ message: 'Invalid bulk action' })
  }),
  reason: z.string().optional(),
  notification_message: z.string().optional(),
});

export const bulkTransactionActionSchema = z.object({
  transaction_ids: z.array(z.string()).min(1, 'At least one transaction must be selected'),
  action: z.enum(['approve', 'decline', 'refund'], {
    errorMap: () => ({ message: 'Invalid bulk action' })
  }),
  reason: z.string().optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file_type: z.enum(['image', 'document', 'csv'], {
    errorMap: () => ({ message: 'Invalid file type' })
  }),
  max_size_mb: z.number().min(1).max(50).default(10),
  allowed_extensions: z.array(z.string()).default(['.jpg', '.jpeg', '.png', '.pdf', '.csv']),
});

// Export validation helper functions
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

export const getValidationErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.errors.forEach(err => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  return errors;
};

// Type exports for TypeScript
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
export type UserCreateData = z.infer<typeof userCreateSchema>;
export type TransactionUpdateData = z.infer<typeof transactionUpdateSchema>;
export type RefundData = z.infer<typeof refundSchema>;
export type TicketUpdateData = z.infer<typeof ticketUpdateSchema>;
export type TicketReplyData = z.infer<typeof ticketReplySchema>;
export type TicketCreateData = z.infer<typeof ticketCreateSchema>;
export type PlanCreateData = z.infer<typeof planCreateSchema>;
export type PlanUpdateData = z.infer<typeof planUpdateSchema>;
export type GeneralSettingsData = z.infer<typeof generalSettingsSchema>;
export type PaymentGatewayData = z.infer<typeof paymentGatewaySchema>;
export type NotificationCreateData = z.infer<typeof notificationCreateSchema>;
export type AnalyticsFilterData = z.infer<typeof analyticsFilterSchema>;
export type BulkUserActionData = z.infer<typeof bulkUserActionSchema>;
export type BulkTransactionActionData = z.infer<typeof bulkTransactionActionSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;