import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPermissions } from '@/lib/auth/server';
import { 
  getAdminNotifications, 
  createAdminNotification, 
  markAllNotificationsAsRead 
} from '@/lib/data/notifications';
import { notificationSchema } from '@/lib/validation/adminValidation';

// GET /api/admin/notifications - Get all notifications with filtering
export async function GET(request: NextRequest) {
  try {
    // Check if user has admin permissions
    await checkAdminPermissions();

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // Get notifications with pagination
    const result = await getAdminNotifications({
      page,
      limit,
      unreadOnly,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status: error.status || 500 }
    );
  }
}

// POST /api/admin/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    // Check if user has admin permissions
    await checkAdminPermissions();

    // Parse request body
    const body = await request.json();

    // Validate request body
    const validatedData = notificationSchema.parse(body);

    // Create notification
    const notification = await createAdminNotification({
      type: validatedData.type,
      message: validatedData.message,
      related_entity: validatedData.related_entity,
      related_id: validatedData.related_id,
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create notification' },
      { status: error.status || 500 }
    );
  }
}

// PATCH /api/admin/notifications - Mark all notifications as read
export async function PATCH(request: NextRequest) {
  try {
    // Check if user has admin permissions
    await checkAdminPermissions();

    // Mark all notifications as read
    await markAllNotificationsAsRead();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark all notifications as read' },
      { status: error.status || 500 }
    );
  }
}