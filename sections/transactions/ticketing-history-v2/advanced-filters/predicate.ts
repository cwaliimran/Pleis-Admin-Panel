import { Ticket } from '../types/types';
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

const EVENT_LABELS: Record<string, string> = {
  'nokturno-opening': 'Nokturno Opening',
  'ljetna-terasa-live': 'Ljetna Terasa Live',
  'cabaret-noir': 'Cabaret Noir',
  'cabaret-season-2026': 'Cabaret Season 2026',
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

export const matchesAdvancedFilters = (ticket: Ticket, values: FilterValues): boolean => {
  const ticketId = asString(values.ticketId).trim().toLowerCase();
  if (ticketId && !ticket.ticketId.toLowerCase().includes(ticketId)) return false;

  const billkoItemCode = asString(values.billkoItemCode).trim().toLowerCase();
  if (billkoItemCode && !(ticket.billkoItemCode || '').toLowerCase().includes(billkoItemCode)) return false;

  const currentOwner = asString(values.currentOwner).trim().toLowerCase();
  if (currentOwner && !ticket.owner.name.toLowerCase().includes(currentOwner) && !ticket.owner.email?.toLowerCase().includes(currentOwner)) return false;

  const company = asString(values.company);
  if (company && company !== 'any' && ticket.company !== COMPANY_LABELS[company]) return false;

  const organization = asString(values.organization);
  if (organization && organization !== 'any' && ticket.organization !== ORGANIZATION_LABELS[organization]) return false;

  const event = asString(values.event);
  if (event && event !== 'any' && ticket.eventName !== EVENT_LABELS[event]) return false;

  const ticketType = asString(values.ticketType);
  if (ticketType && ticketType !== 'any' && ticket.ticketTypeCategory !== ticketType) return false;

  const actions = asStringArray(values.action);
  if (actions.length && !actions.includes(ticket.action)) return false;

  const statuses = asStringArray(values.status);
  if (statuses.length && !statuses.includes(ticket.status)) return false;

  const sources = asStringArray(values.source);
  if (sources.length && !sources.includes(ticket.source)) return false;

  const resaleProtections = asStringArray(values.resaleProtection);
  if (resaleProtections.length && !resaleProtections.includes(ticket.resaleProtection)) return false;

  const scanResults = asStringArray(values.scanResult);
  if (scanResults.length && !(ticket.scanResult && scanResults.includes(ticket.scanResult))) return false;

  const settlementStatuses = asStringArray(values.settlementStatus);
  if (settlementStatuses.length && !settlementStatuses.includes(ticket.settlementStatus || '')) return false;

  if (!matchesTriState(asString(values.hasTransaction) as TriState, ticket.hasTransaction)) return false;
  if (!matchesTriState(asString(values.ownershipChanged) as TriState, ticket.ownershipChanged)) return false;
  if (!matchesTriState(asString(values.fastTrack) as TriState, ticket.fastTrack)) return false;
  if (!matchesTriState(asString(values.repeatable) as TriState, ticket.repeatable)) return false;
  if (!matchesTriState(asString(values.eventEnded) as TriState, ticket.eventEnded)) return false;
  if (!matchesTriState(asString(values.missingFiscalNumber) as TriState, ticket.missingFiscalNumber)) return false;
  if (!matchesTriState(asString(values.billkoErrors) as TriState, ticket.billkoErrors)) return false;
  if (!matchesTriState(asString(values.hasStorno) as TriState, ticket.hasStorno)) return false;
  if (!matchesTriState(asString(values.scanned) as TriState, ticket.scanCount > 0)) return false;

  if (!inRange(ticket.scanCount, asRange(values.scanCount))) return false;
  if (ticket.pricePaid !== null && !inRange(ticket.pricePaid, asRange(values.pricePaid))) return false;
  if (ticket.basePrice !== undefined && !inRange(ticket.basePrice, asRange(values.basePrice))) return false;

  return true;
};
