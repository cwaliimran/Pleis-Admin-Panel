import { LoyaltyEntry } from '../types/types';
import { FilterValues, RangeValue, TriState } from './types';

const ORGANIZATION_LABELS: Record<string, string> = {
  'pleis-cabaret': 'PLEIS Cabaret',
  nokturno: 'Nokturno',
  'alcatraz-zagreb': 'Alcatraz Zagreb',
};

const COMPANY_LABELS: Record<string, string> = {
  'cabaret-grupa': 'Cabaret Grupa d.o.o.',
  'nokturno-ugostiteljstvo': 'Nokturno Ugostiteljstvo d.o.o.',
  'alcatraz-events': 'Alcatraz Events j.d.o.o.',
};

const inRange = (value: number, range: RangeValue): boolean => {
  if (range.min !== '' && value < Number(range.min)) return false;
  if (range.max !== '' && value > Number(range.max)) return false;
  return true;
};

const matchesTriState = (state: TriState, actual: boolean): boolean => state === 'any' || (state === 'yes' ? actual : !actual);

const asStringArray = (value: FilterValues[string]): string[] => (Array.isArray(value) ? value : []);
const asString = (value: FilterValues[string]): string => (typeof value === 'string' ? value : '');
const asRange = (value: FilterValues[string]): RangeValue => (typeof value === 'object' && 'min' in (value as object) ? (value as RangeValue) : { min: '', max: '' });

export const matchesAdvancedFilters = (entry: LoyaltyEntry, values: FilterValues): boolean => {
  const loyaltyScopes = asStringArray(values.loyaltyScope);
  if (loyaltyScopes.length && !loyaltyScopes.includes(entry.scope)) return false;

  const company = asString(values.company);
  if (company && company !== 'any' && entry.company !== COMPANY_LABELS[company]) return false;

  const organization = asString(values.organization);
  if (organization && organization !== 'any' && entry.organization !== ORGANIZATION_LABELS[organization]) return false;

  const entryTypes = asStringArray(values.entryType);
  if (entryTypes.length && !entryTypes.includes(entry.entryType)) return false;

  const sourceTypes = asStringArray(values.sourceType);
  if (sourceTypes.length && !sourceTypes.includes(entry.sourceType)) return false;

  const earningModes = asStringArray(values.earningMode);
  if (earningModes.length && !earningModes.includes(entry.earningMode)) return false;

  const description = asString(values.description).trim().toLowerCase();
  if (description && !entry.description.toLowerCase().includes(description)) return false;

  if (!matchesTriState(asString(values.hasTransaction) as TriState, entry.hasTransaction)) return false;
  if (!matchesTriState(asString(values.hasPairedEntry) as TriState, entry.hasPairedEntry)) return false;
  if (!matchesTriState(asString(values.hasPromotion) as TriState, entry.hasPromotion)) return false;
  if (!matchesTriState(asString(values.capApplied) as TriState, entry.capApplied)) return false;

  const promotionTypes = asStringArray(values.promotionType);
  if (promotionTypes.length && !(entry.promotionType && promotionTypes.includes(entry.promotionType))) return false;

  if (!inRange(entry.points, asRange(values.pointsChange))) return false;
  if (!inRange(entry.basePoints, asRange(values.basePoints))) return false;
  if (entry.billAmount !== undefined && !inRange(entry.billAmount, asRange(values.billAmount))) return false;
  if (!inRange(entry.balanceAfter, asRange(values.balanceAfter))) return false;

  const rewardSources = asStringArray(values.rewardSource);
  if (rewardSources.length && !(entry.reward && rewardSources.includes(entry.reward.source))) return false;

  const rewardKinds = asStringArray(values.rewardKind);
  if (rewardKinds.length && !(entry.reward && rewardKinds.includes(entry.reward.kind))) return false;

  if (!matchesTriState(asString(values.qrIssued) as TriState, Boolean(entry.reward?.qrIssued))) return false;

  const collection = asString(values.collection);
  if (collection && collection !== 'any' && entry.reward?.collection !== collection) return false;

  const collectedBy = asString(values.collectedBy).trim().toLowerCase();
  if (collectedBy && !(entry.reward?.collectedBy || '').toLowerCase().includes(collectedBy)) return false;

  const user = asString(values.user).trim().toLowerCase();
  if (user && !entry.userName.toLowerCase().includes(user)) return false;

  const userSearch = asString(values.userSearch).trim().toLowerCase();
  if (userSearch && !entry.userName.toLowerCase().includes(userSearch)) return false;

  return true;
};
