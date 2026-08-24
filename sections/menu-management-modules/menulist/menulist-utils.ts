import { OrganizationRef } from './types';

/** Extracts the raw id regardless of whether the API sent a string or a populated object. */
export const getOrgId = (value: OrganizationRef): string => {
  if (!value) return '';
  return typeof value === 'string' ? value : value._id;
};

/** Organization records shape differs between the admin (by-company) and organizer list endpoints. */
export const getOrgLabel = (value: OrganizationRef, lookup?: Map<string, string>): string => {
  if (!value) return '-';
  if (typeof value === 'string') return lookup?.get(value) || '-';
  return value.basicInfo?.name || value.title || value.name || (lookup?.get(value._id) ?? '-');
};
