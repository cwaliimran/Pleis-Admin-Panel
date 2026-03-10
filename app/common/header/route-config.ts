/**
 * Configuration for routes that require company/organization selection
 */

export interface RouteRequirement {
  requiresCompany: boolean;
  requiresOrganization: boolean;
}

/**
 * Routes that require company selection
 */
const COMPANY_REQUIRED_ROUTES = [
  '/super-admin/loyalty',
  '/super-admin/rewards',
  '/super-admin/challenges',
  '/super-admin/promotions',
  '/super-admin/members',
  '/super-admin/settings',
  '/super-admin/referrals',
  '/super-admin/transactions',
  '/super-admin/transactions-history',
  '/super-admin/menu-list',
  '/super-admin/menuItems',
  '/super-admin/ticketing',
  '/super-admin/bundles',
  '/super-admin/reservation',
  '/super-admin/res-transactions',
  '/super-admin/calendar',
  '/super-admin/streaks',
  '/super-admin/updates',
  '/super-admin/giveaways',
  '/super-admin/reviews',
  '/super-admin/promo-code',
  '/super-admin/app-ordering/order-management',
  '/super-admin/app-ordering/order-settings',
  '/super-admin/app-ordering/menu-management',
  '/super-admin/app-ordering/order-transactions',
] as const;

/**
 * Routes that require both company AND organization selection
 */
const ORGANIZATION_REQUIRED_ROUTES = [
  '/super-admin/ticketing',
  '/super-admin/reservation',
  '/super-admin/calendar',
  '/super-admin/giveaways',
  '/super-admin/bundles',
  '/super-admin/app-ordering/order-management',
  '/super-admin/app-ordering/menu-management',
  '/super-admin/app-ordering/order-settings',
] as const;

export class RouteConfig {
  /**
   * Check if a route requires company selection
   */
  static requiresCompany(pathname: string): boolean {
    return COMPANY_REQUIRED_ROUTES.some((route) => pathname.startsWith(route));
  }

  /**
   * Check if a route requires organization selection
   */
  static requiresOrganization(pathname: string): boolean {
    return ORGANIZATION_REQUIRED_ROUTES.some((route) => pathname.startsWith(route));
  }

  /**
   * Get requirements for a specific route
   */
  static getRouteRequirements(pathname: string): RouteRequirement {
    return {
      requiresCompany: this.requiresCompany(pathname),
      requiresOrganization: this.requiresOrganization(pathname),
    };
  }

  /**
   * Check if dropdowns should be shown for this route
   */
  static shouldShowDropdowns(pathname: string, userType?: string): boolean {
    return this.requiresCompany(pathname) && userType === 'admin';
  }
}
