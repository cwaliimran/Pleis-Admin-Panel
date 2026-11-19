/**
 * Query params for the analytics scope (#128 / #131): company (super admin)
 * and organizations, sent as a comma-separated list the backend splits.
 */
export interface AnalyticsScopeArgs {
  companyOrganizer?: string;
  organizations?: string[];
}

export const withAnalyticsScope = (params: Record<string, unknown>, scope: AnalyticsScopeArgs = {}) => {
  if (scope.companyOrganizer) params.companyOrganizer = scope.companyOrganizer;
  if (scope.organizations?.length) params.organizations = scope.organizations.join(',');
  return params;
};
