import { RefValue } from './types';

/**
 * Extracts the raw id regardless of whether the API sent a string or a populated object.
 * Always returns a string — a populated object missing `_id` yields '' rather than undefined,
 * which would otherwise slip into id arrays and render keyless list items.
 */
export const getRefId = (value: RefValue): string => {
  if (!value) return '';
  return typeof value === 'string' ? value : value._id || '';
};

/**
 * Resolves a display label for a reference field: uses the populated object's own title/name if
 * the API sent one, otherwise falls back to the id lookup map fetched separately (if given).
 */
export const getRefLabel = (value: RefValue, lookup?: Map<string, string>): string => {
  if (!value) return '-';
  if (typeof value === 'string') return lookup?.get(value) || '-';
  return value.title || value.name || (lookup?.get(value._id) ?? '-');
};

/**
 * Builds a disambiguated serving label: "Type (unit) · Level2", e.g. "Bottle (pcs) · Drink".
 * `unit` alone isn't enough — several serving types (e.g. Bottle, Glass) share the same unit.
 */
export const formatServingLabel = (serving?: { type?: string; code?: string; unit?: string; level2?: string } | null): string => {
  if (!serving) return '';
  const name = serving.type || serving.code || '';
  const unit = serving.unit ? ` (${serving.unit})` : '';
  const category = serving.level2 ? ` · ${serving.level2.charAt(0).toUpperCase()}${serving.level2.slice(1)}` : '';
  return `${name}${unit}${category}`;
};

/**
 * Builds a preset type label as "PIC014 - Coca-Cola". The code is what staff search by, and it
 * disambiguates presets whose names read alike. Falls back to whichever half the API sent.
 */
export const formatPresetTypeLabel = (preset?: { code?: string; name?: string; title?: string } | null): string => {
  if (!preset) return '';
  return [preset.code, preset.name || preset.title].filter(Boolean).join(' - ');
};

/**
 * Trigger label for an already-selected preset type, in the same "CODE - Name" format as the
 * dropdown. Returns undefined for a bare id string so the combobox shows its placeholder rather
 * than a meaningless dash.
 */
export const getPresetTypeLabel = (value: RefValue): string | undefined => {
  if (!value || typeof value === 'string') return undefined;
  return formatPresetTypeLabel(value) || undefined;
};

/** Table shows the serving's disambiguated label — see `formatServingLabel`. */
export const getServingLabel = (value: RefValue): string => {
  if (!value || typeof value === 'string') return '';
  return formatServingLabel(value);
};

/**
 * Images come back from the API as absolute blob URLs, but writes expect only the file key:
 * ".../pleisappcontainerdev/aab35fa4-....jpeg" → "aab35fa4-....jpeg". A value that's already a
 * bare key passes through unchanged. Fresh uploads don't need this — they return the key directly.
 */
export const toImageKey = (image: string): string => {
  if (!image) return '';
  // Drop any ?sas-token / #fragment before taking the last path segment.
  return image.split(/[?#]/)[0].split('/').pop() || '';
};

/** Normalizes a field the API sometimes sends as an array and sometimes as a single bare object. */
export const toRefArray = (value: RefValue[] | RefValue): RefValue[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};
