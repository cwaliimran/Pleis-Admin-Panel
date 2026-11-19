import { Order } from '../types/types';
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

export const matchesAdvancedFilters = (order: Order, values: FilterValues): boolean => {
  const orderReference = asString(values.orderReference).trim().toLowerCase();
  if (orderReference && !order.orderReference.toLowerCase().includes(orderReference)) return false;

  const handledBy = asString(values.handledBy).trim().toLowerCase();
  if (handledBy && !(order.handledBy || '').toLowerCase().includes(handledBy)) return false;

  const handledVia = asString(values.handledVia);
  if (handledVia && handledVia !== 'any' && order.handledVia !== handledVia) return false;

  const company = asString(values.company);
  if (company && company !== 'any' && order.company !== COMPANY_LABELS[company]) return false;

  const organization = asString(values.organization);
  if (organization && organization !== 'any' && order.organization !== ORGANIZATION_LABELS[organization]) return false;

  const round = asString(values.round);
  if (round && round !== 'any' && order.roundType !== round) return false;

  const statuses = asStringArray(values.status);
  if (statuses.length && !statuses.includes(order.status)) return false;

  const paymentTypes = asStringArray(values.paymentType);
  if (paymentTypes.length && !paymentTypes.includes(order.paymentType)) return false;

  const deliveryMethods = asStringArray(values.deliveryMethod);
  if (deliveryMethods.length && !deliveryMethods.includes(order.deliveryMethod)) return false;

  const cancelReasons = asStringArray(values.cancelReason);
  if (cancelReasons.length && !(order.cancelReason && cancelReasons.includes(order.cancelReason))) return false;

  const settlementTracks = asStringArray(values.settlementTrack);
  if (settlementTracks.length && !settlementTracks.includes(order.settlementTrack)) return false;

  const settlementStatuses = asStringArray(values.settlementStatus);
  if (settlementStatuses.length && !settlementStatuses.includes(order.settlementStatus || '')) return false;

  const fiscalizationStatuses = asStringArray(values.fiscalizationStatus);
  if (fiscalizationStatuses.length && !fiscalizationStatuses.includes(order.fiscalizationStatus || '')) return false;

  if (!matchesTriState(asString(values.linkedReservation) as TriState, order.linkedReservation)) return false;
  if (!matchesTriState(asString(values.hasGuestNote) as TriState, order.hasGuestNote)) return false;
  if (!matchesTriState(asString(values.loyaltyPointsAwarded) as TriState, order.loyaltyPointsAwarded)) return false;
  if (!matchesTriState(asString(values.customerNotified) as TriState, Boolean(order.customerNotified))) return false;

  if (!inRange(order.itemCount, asRange(values.itemCount))) return false;
  if (!inRange(order.total, asRange(values.orderTotal))) return false;
  if (order.tipAmount !== undefined && !inRange(order.tipAmount, asRange(values.tip))) return false;

  return true;
};
