import { OrganizationRef, VenueRef } from './types';

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

/**
 * Normalizes the menu's `venue` array to `{ value, label }` pairs — the shape both the table chips
 * and the combobox's `initialSelected` want. A ref sent as a bare id falls back to showing that id
 * until the venue query loads a real title for it.
 */
export const getVenueOptions = (value: VenueRef[] | undefined): { value: string; label: string }[] =>
  (value || []).flatMap((venue) => {
    if (!venue) return [];
    if (typeof venue === 'string') return [{ value: venue, label: venue }];
    return venue._id ? [{ value: venue._id, label: venue.title || venue.name || venue._id }] : [];
  });

/** Flattens the menu's `venue` array to plain ids for the form field. */
export const getVenueIds = (value: VenueRef[] | undefined): string[] => getVenueOptions(value).map((venue) => venue.value);
