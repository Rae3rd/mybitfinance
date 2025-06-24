import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPermissions } from '@/lib/auth/server';
import { getAdminNotificationById, markNotificationAsRead } from '@/lib/data/notifications';

// GET /api/admin/notifications/:id - Get a specific notification
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user has admin permissions
    await checkAdminPermissions();

    const notificationId = params.id;
    
    // Get notification
    const notification = await getAdminNotificationById(notificationId);
    
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error: any) {
    console.error('Error fetching notification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notification' },
      { status: error.status || 500 }
    );
  }
}

// PATCH /api/admin/notifications/:id - Mark a notification as read
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user has admin permissions
    await checkAdminPermissions();

    const notificationId = params.id;
    
    // Check if notification exists
    const notification = await getAdminNotificationById(notificationId);
    
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Mark notification as read
    const updatedNotification = await markNotificationAsRead(notificationId);

    return NextResponse.json(updatedNotification);
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark notification as read' },
      { status: error.status || 500 }
    );
  }
}