import { FilterOption, FilterSectionDef, FilterValues } from './types';

const ANY_OPTION = { value: 'any', label: 'Any' };

const COMPANY_ORGANIZATIONS: Record<string, FilterOption[]> = {
  'cabaret-grupa': [{ value: 'pleis-cabaret', label: 'PLEIS Cabaret' }],
  'nokturno-ugostiteljstvo': [{ value: 'nokturno', label: 'Nokturno' }],
  'alcatraz-events': [{ value: 'alcatraz-zagreb', label: 'Alcatraz Zagreb' }],
};

const ORGANIZATION_VENUES: Record<string, FilterOption[]> = {
  'pleis-cabaret': [{ value: 'pleis-cabaret-tkalciceva', label: 'PLEIS Cabaret — Tkalčićeva' }],
  nokturno: [{ value: 'nokturno-jarun', label: 'Nokturno — Jarun' }],
  'alcatraz-zagreb': [{ value: 'alcatraz-centar', label: 'Alcatraz — Centar' }],
};

const isAny = (value: FilterValues[string]): boolean => !value || value === 'any';
const isYes = (value: FilterValues[string]): boolean => value === 'yes';

export const FILTER_SECTIONS: FilterSectionDef[] = [
  {
    id: 'scope',
    label: 'Scope',
    fields: [
      {
        id: 'company',
        label: 'Company',
        type: 'select',
        superAdminOnly: true,
        resets: ['organization', 'venue'],
        options: [
          ANY_OPTION,
          { value: 'cabaret-grupa', label: 'Cabaret Grupa d.o.o.' },
          { value: 'nokturno-ugostiteljstvo', label: 'Nokturno Ugostiteljstvo d.o.o.' },
          { value: 'alcatraz-events', label: 'Alcatraz Events j.d.o.o.' },
        ],
      },
      {
        id: 'organization',
        label: 'Organization',
        type: 'select',
        resets: ['venue'],
        disabledWhen: (values) => isAny(values.company),
        optionsFor: (values) => [ANY_OPTION, ...(COMPANY_ORGANIZATIONS[values.company as string] || [])],
      },
      {
        id: 'venue',
        label: 'Venue · scan venue',
        type: 'select',
        disabledWhen: (values) => isAny(values.organization),
        optionsFor: (values) => [ANY_OPTION, ...(ORGANIZATION_VENUES[values.organization as string] || [])],
      },
      {
        id: 'event',
        label: 'Event',
        type: 'select',
        options: [
          ANY_OPTION,
          { value: 'nokturno-opening', label: 'Nokturno Opening' },
          { value: 'ljetna-terasa-live', label: 'Ljetna Terasa Live' },
          { value: 'cabaret-noir', label: 'Cabaret Noir' },
          { value: 'cabaret-season-2026', label: 'Cabaret Season 2026' },
        ],
      },
      {
        id: 'ticketType',
        label: 'Ticket type',
        type: 'select',
        options: [ANY_OPTION, { value: 'standard', label: 'Standard ulaznica' }, { value: 'vip', label: 'VIP ulaznica' }, { value: 'season_pass', label: 'Season pass' }],
      },
      { id: 'eventDate', label: 'Event date', type: 'date-range' },
    ],
  },
  {
    id: 'ticket',
    label: 'Ticket',
    fields: [
      {
        id: 'action',
        label: 'Action',
        type: 'pill',
        options: [
          { value: 'purchase', label: 'purchase' },
          { value: 'gift', label: 'gift' },
          { value: 'transfer', label: 'transfer' },
          { value: 'refund', label: 'refund' },
        ],
      },
      {
        id: 'status',
        label: 'Status',
        type: 'pill',
        options: [
          { value: 'active', label: 'active' },
          { value: 'used', label: 'used' },
          { value: 'partially_used', label: 'partially_used' },
          { value: 'expired', label: 'expired' },
          { value: 'refunded', label: 'refunded' },
          { value: 'superseded', label: 'superseded' },
          { value: 'cancelled', label: 'cancelled' },
        ],
      },
      {
        id: 'source',
        label: 'Source',
        type: 'pill',
        options: [
          { value: 'direct_purchase', label: 'direct_purchase' },
          { value: 'waitlist', label: 'waitlist' },
          { value: 'giveaway', label: 'giveaway' },
          { value: 'loyalty_reward', label: 'loyalty_reward' },
          { value: 'transfer', label: 'transfer' },
          { value: 'gift', label: 'gift' },
        ],
      },
      { id: 'hasTransaction', label: 'Has a transaction', type: 'tristate', helperText: 'No isolates free gift rows.' },
      { id: 'ownershipChanged', label: 'Ownership changed', type: 'tristate' },
      { id: 'fastTrack', label: 'Fast track', type: 'tristate' },
      {
        id: 'timeSensitivePricing',
        label: 'Time-sensitive pricing',
        type: 'pill',
        options: [
          { value: 'none', label: 'none' },
          { value: 'early_bird', label: 'early_bird' },
          { value: 'last_minute', label: 'last_minute' },
        ],
      },
      {
        id: 'resaleProtection',
        label: 'Resale protection',
        type: 'pill',
        options: [
          { value: 'none', label: 'none' },
          { value: 'name', label: 'name' },
          { value: 'name_oib', label: 'name_oib' },
        ],
      },
      { id: 'repeatable', label: 'Repeatable', type: 'tristate', resets: ['usesRemaining'] },
      { id: 'scanCount', label: 'Scan count', type: 'range' },
      {
        id: 'usesRemaining',
        label: 'Uses remaining',
        type: 'range',
        helperText: 'Only meaningful on repeatable tickets.',
        disabledWhen: (values) => !isYes(values.repeatable),
        disabledHelperText: 'Disabled — set Repeatable to Yes first.',
      },
      { id: 'linkedReservation', label: 'Linked reservation', type: 'tristate' },
    ],
  },
  {
    id: 'people',
    label: 'People',
    fields: [
      { id: 'currentOwner', label: 'Current owner', type: 'text', placeholder: 'Type to match...' },
      { id: 'originalBuyer', label: 'Original buyer', type: 'text', placeholder: 'Type to match...' },
      { id: 'assignedHolder', label: 'Assigned holder', type: 'text', placeholder: 'Name, surname, OIB or date of birth' },
      { id: 'ticketId', label: 'Ticket ID', type: 'text', placeholder: 'Type to match...' },
      { id: 'billkoItemCode', label: 'Billko item code', type: 'text', placeholder: 'Type to match...' },
    ],
  },
  {
    id: 'scans',
    label: 'Scans',
    fields: [
      {
        id: 'scanResult',
        label: 'Scan result',
        type: 'pill',
        options: [
          { value: 'accepted', label: 'accepted' },
          { value: 'rejected_already_used', label: 'rejected_already_used' },
          { value: 'rejected_max_uses_reached', label: 'rejected_max_uses_reached' },
          { value: 'rejected_expired', label: 'rejected_expired' },
          { value: 'rejected_invalid', label: 'rejected_invalid' },
        ],
      },
      { id: 'scanned', label: 'Scanned', type: 'tristate', triStateLabels: ['Any', 'Yes', 'Never scanned'] },
      { id: 'scannedBy', label: 'Scanned by', type: 'text', placeholder: 'Type to match...' },
      {
        id: 'scannedVia',
        label: 'Scanned via',
        type: 'select',
        options: [ANY_OPTION, { value: 'mobile_staff_app', label: 'Mobile staff app' }, { value: 'gate_scanner', label: 'Gate scanner' }, { value: 'self_scan', label: 'Self-scan via app' }],
      },
      {
        id: 'scanVenue',
        label: 'Scan venue',
        type: 'select',
        options: [ANY_OPTION, { value: 'pleis-cabaret-tkalciceva', label: 'PLEIS Cabaret — Tkalčićeva' }, { value: 'nokturno-jarun', label: 'Nokturno — Jarun' }, { value: 'alcatraz-centar', label: 'Alcatraz — Centar' }],
      },
      { id: 'scanTime', label: 'Scan time', type: 'date-range' },
    ],
  },
  {
    id: 'money',
    label: 'Money',
    fields: [
      { id: 'basePrice', label: 'Base price', type: 'range', unit: 'EUR' },
      { id: 'pricePaid', label: 'Price paid', type: 'range', unit: 'EUR' },
      { id: 'discounted', label: 'Discounted', type: 'tristate', helperText: 'Base price differs from the price paid.' },
      { id: 'fastTrackFee', label: 'Fast track fee', type: 'range', unit: 'EUR' },
      { id: 'serviceFee', label: 'Service fee', type: 'range', unit: 'EUR', superAdminOnly: true },
      { id: 'transferFee', label: 'Transfer fee', type: 'range', unit: 'EUR' },
      {
        id: 'taxRate',
        label: 'Tax rate',
        type: 'pill',
        options: [
          { value: '0', label: '0' },
          { value: '5', label: '5' },
          { value: '13', label: '13' },
          { value: '25', label: '25' },
        ],
      },
      {
        id: 'taxLabel',
        label: 'Tax label',
        type: 'pill',
        options: [
          { value: 'Tg0', label: 'Tg0' },
          { value: 'Tg1', label: 'Tg1' },
          { value: 'Tg2', label: 'Tg2' },
          { value: 'Tg3', label: 'Tg3' },
          { value: 'Tg4', label: 'Tg4' },
        ],
      },
      { id: 'commissionRate', label: 'Commission rate', type: 'range', unit: '%' },
    ],
  },
  {
    id: 'documentsSettlement',
    label: 'Documents & settlement',
    fields: [
      {
        id: 'invoicePair',
        label: 'Invoice pair',
        type: 'select',
        options: [ANY_OPTION, { value: 'complete', label: 'Complete' }, { value: 'incomplete', label: 'Incomplete' }],
        helperText: 'A ticket purchase always produces two invoices. An organizer counts only the invoice they can see.',
      },
      {
        id: 'invoiceRole',
        label: 'Invoice role',
        type: 'pill',
        options: [
          { value: 'ticketing_service_fee', label: 'ticketing_service_fee', superAdminOnly: true },
          { value: 'ticketing_tickets', label: 'ticketing_tickets' },
          { value: 'refund_storno', label: 'refund_storno' },
        ],
      },
      {
        id: 'invoiceStatus',
        label: 'Invoice status',
        type: 'pill',
        options: [
          { value: 'created', label: 'created' },
          { value: 'fiscalized', label: 'fiscalized' },
          { value: 'sent', label: 'sent' },
          { value: 'delivered', label: 'delivered' },
          { value: 'voided', label: 'voided' },
          { value: 'error', label: 'error' },
        ],
      },
      { id: 'missingFiscalNumber', label: 'Missing fiscal number', type: 'tristate' },
      { id: 'billkoErrors', label: 'Billko errors', type: 'tristate' },
      { id: 'hasStorno', label: 'Has storno', type: 'tristate' },
      { id: 'eventEnded', label: 'Event ended', type: 'tristate', helperText: 'Drives payout eligibility.' },
      {
        id: 'settlementStatus',
        label: 'Settlement status',
        type: 'pill',
        options: [
          { value: 'HELD', label: 'HELD' },
          { value: 'PENDING', label: 'PENDING' },
          { value: 'SETTLED', label: 'SETTLED' },
          { value: 'EXCLUDED', label: 'EXCLUDED' },
        ],
      },
      {
        id: 'batch',
        label: 'Batch',
        type: 'select',
        options: [ANY_OPTION, { value: 'PB-2026-06-30', label: 'PB-2026-06-30' }, { value: 'not-in-a-batch', label: 'Not in a batch' }],
      },
    ],
  },
];

export const isSectionDisabled = (section: FilterSectionDef, values: FilterValues): boolean => Boolean(section.disabledWhen?.(values));

export const getFieldById = (id: string) => FILTER_SECTIONS.flatMap((section) => section.fields).find((field) => field.id === id);
