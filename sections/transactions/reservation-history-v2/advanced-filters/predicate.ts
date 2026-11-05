import { Reservation } from '../types/types';
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

export const matchesAdvancedFilters = (reservation: Reservation, values: FilterValues): boolean => {
  const company = asString(values.company);
  if (company && company !== 'any' && reservation.company !== COMPANY_LABELS[company]) return false;

  const organization = asString(values.organization);
  if (organization && organization !== 'any' && reservation.organization !== ORGANIZATION_LABELS[organization]) return false;

  const reservationType = asString(values.reservationType);
  if (reservationType && reservationType !== 'any' && reservation.reservationTypeCategory !== reservationType) return false;

  const actions = asStringArray(values.action);
  if (actions.length && !actions.includes(reservation.action)) return false;

  const statuses = asStringArray(values.status);
  if (statuses.length && !statuses.includes(reservation.status)) return false;

  const conditions = asStringArray(values.condition);
  if (conditions.length && !conditions.includes(reservation.condition)) return false;

  const table = asString(values.table).trim().toLowerCase();
  if (table && !(reservation.table || '').toLowerCase().includes(table)) return false;

  const contactPhone = asString(values.contactPhone).trim().toLowerCase();
  if (contactPhone && !(reservation.contactPhone || '').toLowerCase().includes(contactPhone)) return false;

  if (!inRange(reservation.guests, asRange(values.partySize))) return false;

  if (!matchesTriState(asString(values.hasGuestNote) as TriState, reservation.hasGuestNote)) return false;
  if (!matchesTriState(asString(values.autoConfirmed) as TriState, reservation.autoConfirmed)) return false;
  if (!matchesTriState(asString(values.hasRejectionReason) as TriState, reservation.hasRejectionReason)) return false;

  const confirmedBy = asString(values.confirmedBy).trim().toLowerCase();
  if (confirmedBy && !reservation.staffLabel.toLowerCase().includes(confirmedBy)) return false;

  const checkedInBy = asString(values.checkedInBy).trim().toLowerCase();
  if (checkedInBy && !reservation.staffLabel.toLowerCase().includes(checkedInBy)) return false;

  const closedBy = asString(values.closedBy).trim().toLowerCase();
  if (closedBy && !reservation.staffLabel.toLowerCase().includes(closedBy)) return false;

  const staffActionVia = asString(values.staffActionVia);
  if (staffActionVia && staffActionVia !== 'any' && reservation.staffVia !== staffActionVia) return false;

  const voucherStatuses = asStringArray(values.voucherStatus);
  if (voucherStatuses.length && !(reservation.voucher && voucherStatuses.includes(reservation.voucher.status))) return false;

  const voucherCode = asString(values.voucherCode).trim().toLowerCase();
  if (voucherCode && !(reservation.voucher?.code || '').toLowerCase().includes(voucherCode)) return false;

  const settlementStatuses = asStringArray(values.settlementStatus);
  if (settlementStatuses.length && !settlementStatuses.includes(reservation.settlementStatus || '')) return false;

  if (reservation.voucher && !inRange(reservation.voucher.prepaidAmount, asRange(values.prepaidAmount))) return false;
  if (reservation.voucher && !inRange(reservation.voucher.balance, asRange(values.voucherBalance))) return false;

  return true;
};
