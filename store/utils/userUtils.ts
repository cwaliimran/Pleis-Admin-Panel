import { RootState } from '../store';

/**
 * Utility function to get user role information from Redux state
 * @param getState - The getState function from RTK Query
 * @returns Object containing user role information
 */
export const getUserRoleInfo = (getState: () => unknown) => {
  const state = getState() as RootState;
  const user = state?.userSlice?.user;
  const userRole = user?.role;

  return {
    user,
    userRole,
    isAuthenticated: !!user,
    isSuperAdmin: userRole === 'superAdmin' || userRole === 'admin',
    isOrganizer: userRole === 'organizer',
    isAdmin: userRole === 'admin',
  };
};

/**
 * Utility function to get appropriate API route based on user role
 * @param adminRoute - The admin API route
 * @param organizerRoute - The organizer/regular API route
 * @param isSuperAdmin - Whether the user is a super admin
 * @returns The appropriate API route
 */
export const getApiRouteByRole = (adminRoute: string, organizerRoute: string, isSuperAdmin: boolean): string => {
  return isSuperAdmin ? adminRoute : organizerRoute;
};

/**
 * Utility function to check if user has permission for admin-only operations
 * @param userRole - The user's role
 * @param throwError - Whether to throw an error if unauthorized
 * @returns Boolean indicating if user is authorized
 */
export const checkAdminPermission = (userRole: string | undefined, throwError = true): boolean => {
  const isAuthorized = userRole === 'superAdmin' || userRole === 'admin';

  if (!isAuthorized && throwError) {
    throw new Error('Unauthorized: Only administrators can perform this action');
  }

  return isAuthorized;
};
