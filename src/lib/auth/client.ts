'use client';

import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/nextjs';

/**
 * Client-side authentication utilities
 * IMPORTANT: This file should only be imported in client components
 */

/**
 * Hook to access authentication state
 * @returns Clerk's useAuth hook result
 */
export function useAuth() {
  return useClerkAuth();
}

/**
 * Hook to access the current user
 * @returns Clerk's useUser hook result
 */
export function useUser() {
  return useClerkUser();
}

/**
 * Check if the current user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export function useIsAuthenticated() {
  const { isSignedIn, isLoaded } = useAuth();
  return { isAuthenticated: isSignedIn && isLoaded, isLoaded };
}

/**
 * Get the current user's role from metadata
 * @returns The user's role or null if not available
 */
export function useUserRole() {
  const { user, isLoaded } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;
  
  return { 
    role: role || null, 
    isLoaded 
  };
}

/**
 * Check if the current user has a specific role
 * @param allowedRoles Array of roles to check against
 * @returns Boolean indicating if user has one of the allowed roles
 */
export function useHasRole(allowedRoles: string[]) {
  const { role, isLoaded } = useUserRole();
  
  return { 
    hasRole: isLoaded && role ? allowedRoles.includes(role) : false,
    isLoaded,
    role
  };
}

/**
 * Check if the current user has admin permissions
 * @returns Boolean indicating if user has admin permissions
 */
export function useIsAdmin() {
  return useHasRole(['admin', 'super_admin', 'moderator', 'auditor']);
}