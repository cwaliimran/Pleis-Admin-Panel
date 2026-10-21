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
        label: 'Venue',
        type: 'select',
        disabledWhen: (values) => isAny(values.organization),
        optionsFor: (values) => [ANY_OPTION, ...(ORGANIZATION_VENUES[values.organization as string] || [])],
      },
      {
        id: 'linkedEvent',
        label: 'Linked event',
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
        id: 'reservationType',
        label: 'Reservation type',
        type: 'select',
        options: [ANY_OPTION, { value: 'standard_table', label: 'Standard table' }, { value: 'vip_booth', label: 'VIP booth' }, { value: 'group_table', label: 'Group table' }],
      },
      {
        id: 'timeslot',
        label: 'Timeslot',
        type: 'select',
        options: [ANY_OPTION, { value: 'first_seating', label: 'First seating' }, { value: 'second_seating', label: 'Second seating' }, { value: 'late_seating', label: 'Late seating' }],
      },
      { id: 'timeOfDay', label: 'Time of day', type: 'range', unit: 'h' },
    ],
  },
  {
    id: 'reservation',
    label: 'Reservation',
    fields: [
      {
        id: 'action',
        label: 'Action',
        type: 'pill',
        options: [
          { value: 'create', label: 'create' },
          { value: 'update', label: 'update' },
          { value: 'cancel', label: 'cancel' },
          { value: 'refund', label: 'refund' },
          { value: 'no_show', label: 'no_show' },
        ],
      },
      {
        id: 'status',
        label: 'Status',
        type: 'pill',
        options: [
          { value: 'new', label: 'new' },
          { value: 'awaiting_payment', label: 'awaiting_payment' },
          { value: 'confirmed', label: 'confirmed' },
          { value: 'show', label: 'show' },
          { value: 'no_show', label: 'no_show' },
          { value: 'cancelled', label: 'cancelled' },
          { value: 'expired', label: 'expired' },
        ],
      },
      {
        id: 'condition',
        label: 'Condition',
        type: 'pill',
        options: [
          { value: 'free', label: 'free' },
          { value: 'minimum_spend', label: 'minimum_spend' },
        ],
      },
      { id: 'partySize', label: 'Party size', type: 'range' },
      { id: 'table', label: 'Table', type: 'text', placeholder: 'Type to match...' },
      {
        id: 'occasion',
        label: 'Occasion',
        type: 'select',
        options: [ANY_OPTION, { value: 'birthday', label: 'Birthday' }, { value: 'anniversary', label: 'Anniversary' }, { value: 'business', label: 'Business' }, { value: 'other', label: 'Other' }],
      },
      { id: 'hasGuestNote', label: 'Has guest note', type: 'tristate' },
      { id: 'autoConfirmed', label: 'Auto-confirmed', type: 'tristate' },
      { id: 'hasRejectionReason', label: 'Has rejection reason', type: 'tristate' },
      { id: 'contactPhone', label: 'Contact phone', type: 'text', placeholder: 'Partial match' },
    ],
  },
  {
    id: 'staff',
    label: 'Staff',
    fields: [
      { id: 'confirmedBy', label: 'Confirmed by', type: 'text', placeholder: 'User picker, or Auto-confirmed' },
      { id: 'checkedInBy', label: 'Checked in by', type: 'text', placeholder: 'Type to match...' },
      { id: 'closedBy', label: 'Closed by', type: 'text', placeholder: 'Type to match...', helperText: 'No-show or cancellation.' },
      {
        id: 'staffActionVia',
        label: 'Staff action via',
        type: 'select',
        options: [ANY_OPTION, { value: 'web_admin_app', label: 'Web admin app' }, { value: 'mobile_staff_app', label: 'Mobile staff app' }, { value: 'auto', label: 'Auto (system)' }],
      },
    ],
  },
  {
    id: 'moneyVoucher',
    label: 'Money & voucher',
    fields: [
      { id: 'prepaidAmount', label: 'Prepaid amount', type: 'range', unit: 'EUR' },
      {
        id: 'voucherStatus',
        label: 'Voucher status',
        type: 'pill',
        options: [
          { value: 'ISSUED', label: 'ISSUED' },
          { value: 'PARTIALLY_USED', label: 'PARTIALLY_USED' },
          { value: 'USED', label: 'USED' },
          { value: 'EXPIRED', label: 'EXPIRED' },
          { value: 'CANCELLED', label: 'CANCELLED' },
          { value: 'FORFEITED', label: 'FORFEITED' },
        ],
      },
      { id: 'voucherBalance', label: 'Voucher balance', type: 'range', unit: 'EUR' },
      { id: 'initialValue', label: 'Initial value', type: 'range', unit: 'EUR' },
      {
        id: 'validity',
        label: 'Validity',
        type: 'select',
        options: [ANY_OPTION, { value: 'within_window', label: 'Within window' }, { value: 'outside_window', label: 'Outside window' }],
        helperText: 'Validity is a window, not a status — a voucher can be ISSUED and outside its window at once.',
      },
      { id: 'resolutionReason', label: 'Resolution reason', type: 'tristate' },
      { id: 'unspentBalance', label: 'Unspent balance', type: 'range', unit: 'EUR' },
      { id: 'voucherCode', label: 'Voucher code', type: 'text', placeholder: 'Type to match...' },
      {
        id: 'redeemableAt',
        label: 'Redeemable at',
        type: 'select',
        options: [ANY_OPTION, { value: 'pleis-cabaret-tkalciceva', label: 'PLEIS Cabaret — Tkalčićeva' }, { value: 'nokturno-jarun', label: 'Nokturno — Jarun' }, { value: 'alcatraz-centar', label: 'Alcatraz — Centar' }],
      },
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
        id: 'exclusionReason',
        label: 'Exclusion reason',
        type: 'pill',
        options: [
          { value: 'VOUCHER_FUNDED', label: 'VOUCHER_FUNDED' },
          { value: 'REFUNDED', label: 'REFUNDED' },
          { value: 'CHARGEBACK', label: 'CHARGEBACK' },
          { value: 'Manual', label: 'Manual' },
        ],
        helperText: 'Every prepaid reservation is EXCLUDED with VOUCHER_FUNDED by design.',
      },
    ],
  },
  {
    id: 'accessCodes',
    label: 'Access codes',
    fields: [
      {
        id: 'accessType',
        label: 'Access type',
        type: 'pill',
        options: [
          { value: 'owner', label: 'owner' },
          { value: 'guest', label: 'guest' },
        ],
      },
      {
        id: 'codeStatus',
        label: 'Code status',
        type: 'pill',
        options: [
          { value: 'active', label: 'active' },
          { value: 'used', label: 'used' },
          { value: 'revoked', label: 'revoked' },
        ],
      },
      { id: 'checkedIn', label: 'Checked in', type: 'tristate' },
      { id: 'sharedCodes', label: 'Shared codes', type: 'range' },
      { id: 'grantedBy', label: 'Granted by', type: 'text', placeholder: 'Type to match...' },
      { id: 'scannedBy', label: 'Scanned by', type: 'text', placeholder: 'Type to match...' },
      {
        id: 'scannedVia',
        label: 'Scanned via',
        type: 'select',
        options: [ANY_OPTION, { value: 'web_admin_app', label: 'Web admin app' }, { value: 'mobile_staff_app', label: 'Mobile staff app' }, { value: 'gate_scanner', label: 'Gate scanner' }],
      },
      { id: 'accessCode', label: 'Access code', type: 'text', placeholder: 'Type to match...' },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    fields: [
      {
        id: 'confirmationStatus',
        label: 'Confirmation status',
        type: 'select',
        options: [ANY_OPTION, { value: 'generated', label: 'Generated' }, { value: 'not_generated', label: 'Not generated' }],
      },
      { id: 'carriesVoucherBlock', label: 'Carries voucher block', type: 'tristate' },
      {
        id: 'confirmationDelivery',
        label: 'Confirmation delivery',
        type: 'pill',
        options: [
          { value: 'pending', label: 'pending' },
          { value: 'sent', label: 'sent' },
          { value: 'delivered', label: 'delivered' },
          { value: 'bounced', label: 'bounced' },
        ],
      },
    ],
  },
];

export const isSectionDisabled = (section: FilterSectionDef, values: FilterValues): boolean => Boolean(section.disabledWhen?.(values));

export const getFieldById = (id: string) => FILTER_SECTIONS.flatMap((section) => section.fields).find((field) => field.id === id);
