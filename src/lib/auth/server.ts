import { auth as clerkAuth } from '@clerk/nextjs/server';

/**
 * Server-side authentication utilities
 * IMPORTANT: This file should only be imported in server components or API routes
 */

/**
 * Get the current authenticated user's session
 * @returns The auth object containing userId and sessionClaims
 */
export function getAuth() {
  return clerkAuth();
}

/**
 * Check if a user is authenticated
 * @returns The userId if authenticated, null otherwise
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await getAuth();
  return userId;
}

/**
 * Get the user's role from session claims
 * @returns The user's role or null if not available
 */
export async function getUserRole(): Promise<string | null> {
  const { sessionClaims } = await getAuth();
  return (sessionClaims?.metadata as Record<string, unknown>)?.role as string || null;
}

/**
 * Check if the current user has admin permissions
 * @returns Object containing userId and role if authorized
 * @throws Error if not authenticated or insufficient permissions
 */
export async function checkAdminPermissions(): Promise<{ userId: string; role: string }> {
  const { userId, sessionClaims } = await getAuth();
  
  if (!userId) {
    throw new Error('Unauthorized: Not authenticated');
  }

  // Check if user has admin role
  const userRole = (sessionClaims?.metadata as Record<string, unknown>)?.role as string || '';
  if (!['admin', 'super_admin', 'moderator', 'auditor'].includes(userRole)) {
    throw new Error('Unauthorized: Insufficient permissions');
  }

  return { userId, role: userRole };
}

/**
 * Check if the current user has specific role permissions
 * @param allowedRoles Array of roles that are allowed
 * @returns Object containing userId and role if authorized
 * @throws Error if not authenticated or insufficient permissions
 */
export async function checkRolePermissions(allowedRoles: string[]): Promise<{ userId: string; role: string }> {
  const { userId, sessionClaims } = await getAuth();
  
  if (!userId) {
    throw new Error('Unauthorized: Not authenticated');
  }

  // Check if user has allowed role
  const userRole = (sessionClaims?.metadata as Record<string, unknown>)?.role as string || '';
  if (!allowedRoles.includes(userRole)) {
    throw new Error(`Unauthorized: Role '${userRole}' does not have sufficient permissions`);
  }

  return { userId, role: userRole };
}