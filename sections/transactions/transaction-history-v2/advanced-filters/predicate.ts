import { Transaction } from '../types/types';
import { RangeValue, TriState, FilterValues } from './types';

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

const PAYMENT_METHOD_MATCHERS: Record<string, (method: string) => boolean> = {
  card: (method) => method.startsWith('Card'),
  apple_pay: (method) => method === 'Apple Pay',
  google_pay: (method) => method === 'Google Pay',
  cash: (method) => method.startsWith('Cash'),
  organizer_pos: (method) => method === 'Organizer POS',
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

export const matchesAdvancedFilters = (transaction: Transaction, values: FilterValues): boolean => {
  const transactionId = asString(values.transactionId).trim().toLowerCase();
  if (transactionId && !transaction.transactionId.toLowerCase().includes(transactionId) && !transaction.reference.toLowerCase().includes(transactionId)) {
    return false;
  }

  const company = asString(values.company);
  if (company && company !== 'any' && transaction.detail.parties.organizer?.name !== COMPANY_LABELS[company]) return false;

  const organization = asString(values.organization);
  if (organization && organization !== 'any' && transaction.organization !== ORGANIZATION_LABELS[organization]) return false;

  const modules = asStringArray(values.module);
  if (modules.length && !modules.includes(transaction.category)) return false;

  const transactionTypes = asStringArray(values.transactionType);
  if (transactionTypes.length && !transactionTypes.includes(transaction.subtype)) return false;

  const statuses = asStringArray(values.status);
  if (statuses.length && !statuses.includes(transaction.status)) return false;

  const customer = asString(values.customer).trim().toLowerCase();
  if (customer) {
    const isGuestQuery = customer.includes('guest');
    const matchesGuest = isGuestQuery && !transaction.user;
    const matchesUser = Boolean(transaction.user) && (transaction.user!.name.toLowerCase().includes(customer) || transaction.user!.email.toLowerCase().includes(customer));
    if (!matchesGuest && !matchesUser) return false;
  }

  const email = asString(values.email).trim().toLowerCase();
  if (email && !(transaction.user?.email.toLowerCase().includes(email))) return false;

  const buyerTypes = asStringArray(values.buyerType);
  if (buyerTypes.length) {
    const isCompanyBuyer = transaction.category === 'subscriptions';
    const matches = (buyerTypes.includes('company') && isCompanyBuyer) || (buyerTypes.includes('person') && !isCompanyBuyer);
    if (!matches) return false;
  }

  const paymentMethods = asStringArray(values.paymentMethod);
  if (paymentMethods.length) {
    const method = transaction.paymentMethod || '';
    if (!paymentMethods.some((m) => PAYMENT_METHOD_MATCHERS[m]?.(method))) return false;
  }

  const settlementTracks = asStringArray(values.settlementTrack);
  if (settlementTracks.length) {
    const track = transaction.detail.settlement.track;
    const matches = settlementTracks.some((t) => (t === 'offapp' ? track === 'off_app_batch' : track === 'payout'));
    if (!matches) return false;
  }

  const settlementStatuses = asStringArray(values.settlementStatus);
  if (settlementStatuses.length) {
    const matches = settlementStatuses.some((s) => (s === 'SETTLED' ? transaction.settlementStatus === 'PAID' : transaction.settlementStatus === s));
    if (!matches) return false;
  }

  const exclusionReasons = asStringArray(values.exclusionReason);
  if (exclusionReasons.length) {
    const note = transaction.settlementNote || '';
    if (!exclusionReasons.some((reason) => note.toUpperCase().includes(reason.toUpperCase()))) return false;
  }

  const fiscalizationStatuses = asStringArray(values.fiscalizationStatus);
  if (fiscalizationStatuses.length && !fiscalizationStatuses.includes(transaction.fiscalizationStatus || '')) return false;

  const documentStatuses = asStringArray(values.documentStatus);
  if (documentStatuses.length && !documentStatuses.includes(transaction.detail.fiscalization.documentStatus)) return false;

  if (!inRange(transaction.amount, asRange(values.grossAmount))) return false;
  if (transaction.organizerNet !== null && !inRange(transaction.organizerNet, asRange(values.organizerNet))) return false;
  if (!inRange(transaction.pleisNet, asRange(values.pleisNet))) return false;
  if (transaction.commissionRate !== null && !inRange(transaction.commissionRate, asRange(values.commissionRate))) return false;

  if (!matchesTriState(asString(values.negativePleisNet) as TriState, transaction.pleisNet < 0)) return false;

  return true;
};
