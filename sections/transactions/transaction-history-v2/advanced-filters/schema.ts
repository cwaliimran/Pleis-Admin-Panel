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
        id: 'country',
        label: 'Country · fiscal jurisdiction',
        type: 'select',
        superAdminOnly: true,
        options: [ANY_OPTION, { value: 'hr', label: 'Croatia' }, { value: 'ba', label: 'Bosnia & Herzegovina' }, { value: 'si', label: 'Slovenia' }],
      },
      {
        id: 'currency',
        label: 'Currency',
        type: 'select',
        options: [ANY_OPTION, { value: 'eur', label: 'EUR' }, { value: 'usd', label: 'USD' }, { value: 'gbp', label: 'GBP' }],
      },
    ],
  },
  {
    id: 'transaction',
    label: 'Transaction',
    fields: [
      { id: 'transactionId', label: 'Transaction id', type: 'text', placeholder: 'Type to match...' },
      {
        id: 'module',
        label: 'Module',
        type: 'pill',
        options: [
          { value: 'ticketing', label: 'Ticketing' },
          { value: 'reservations', label: 'Reservations' },
          { value: 'ordering', label: 'Ordering' },
          { value: 'loyalty', label: 'Loyalty' },
          { value: 'subscriptions', label: 'Subscriptions' },
        ],
      },
      {
        id: 'transactionType',
        label: 'Transaction type',
        type: 'pill',
        options: [
          { value: 'ticketing_purchase', label: 'ticketing_purchase' },
          { value: 'ticketing_transfer', label: 'ticketing_transfer' },
          { value: 'ticketing_refund', label: 'ticketing_refund' },
          { value: 'reservation_purchase', label: 'reservation_purchase' },
          { value: 'reservation_refund', label: 'reservation_refund' },
          { value: 'ordering_purchase', label: 'ordering_purchase' },
          { value: 'ordering_refund', label: 'ordering_refund' },
          { value: 'loyalty_reward_redemption', label: 'loyalty_reward_redemption' },
          { value: 'subscription_payment', label: 'subscription_payment' },
        ],
      },
      {
        id: 'status',
        label: 'Status',
        type: 'pill',
        options: [
          { value: 'pending', label: 'pending' },
          { value: 'awaiting_confirmation', label: 'awaiting_confirmation' },
          { value: 'awaiting_payment', label: 'awaiting_payment' },
          { value: 'completed', label: 'completed' },
          { value: 'failed', label: 'failed' },
          { value: 'cancelled', label: 'cancelled' },
          { value: 'expired', label: 'expired' },
          { value: 'refunded', label: 'refunded' },
          { value: 'partially_refunded', label: 'partially_refunded' },
        ],
      },
      {
        id: 'refundRelationship',
        label: 'Refund relationship',
        type: 'select',
        options: [ANY_OPTION, { value: 'is_refund', label: 'Is a refund' }, { value: 'is_refunded', label: 'Is refunded' }, { value: 'unrelated', label: 'Not related' }],
      },
      {
        id: 'payLaterParent',
        label: 'Pay-later parent',
        type: 'select',
        options: [ANY_OPTION, { value: 'is_parent', label: 'Is a pay-later parent' }, { value: 'is_child', label: 'Is a pay-later child' }, { value: 'unrelated', label: 'Not related' }],
      },
      {
        id: 'language',
        label: 'Language',
        type: 'pill',
        options: [
          { value: 'hr', label: 'hr' },
          { value: 'en', label: 'en' },
        ],
      },
    ],
  },
  {
    id: 'buyer',
    label: 'Buyer',
    fields: [
      { id: 'customer', label: 'Customer', type: 'text', placeholder: 'User picker, or Guest (no account)' },
      {
        id: 'buyerType',
        label: 'Buyer type',
        type: 'pill',
        options: [
          { value: 'person', label: 'Person' },
          { value: 'company', label: 'Company' },
        ],
      },
      {
        id: 'buyerCountry',
        label: 'Buyer country',
        type: 'select',
        options: [ANY_OPTION, { value: 'hr', label: 'Croatia' }, { value: 'ba', label: 'Bosnia & Herzegovina' }, { value: 'si', label: 'Slovenia' }],
      },
      { id: 'buyerCity', label: 'Buyer city', type: 'text', placeholder: 'Type to match...' },
      { id: 'email', label: 'Email', type: 'text', placeholder: 'Partial match' },
      { id: 'companyOrOib', label: 'Company name or OIB', type: 'text', placeholder: 'Partial match' },
      {
        id: 'addressCompleteness',
        label: 'Address completeness',
        type: 'select',
        options: [ANY_OPTION, { value: 'complete', label: 'Complete' }, { value: 'incomplete', label: 'Incomplete' }],
        helperText: 'Incomplete = requires a Billko invoice and is missing street, number, city, postal code or country.',
      },
    ],
  },
  {
    id: 'payment',
    label: 'Payment',
    fields: [
      {
        id: 'paymentMethod',
        label: 'Payment method',
        type: 'pill',
        options: [
          { value: 'card', label: 'card' },
          { value: 'apple_pay', label: 'apple_pay' },
          { value: 'google_pay', label: 'google_pay' },
          { value: 'cash', label: 'cash' },
          { value: 'organizer_pos', label: 'organizer_pos' },
          { value: 'voucher', label: 'voucher' },
          { value: 'mixed', label: 'mixed' },
        ],
      },
      {
        id: 'cardBrand',
        label: 'Card brand',
        type: 'pill',
        options: [
          { value: 'visa', label: 'visa' },
          { value: 'mastercard', label: 'mastercard' },
          { value: 'amex', label: 'amex' },
        ],
      },
      {
        id: 'gatewayProvider',
        label: 'Gateway provider',
        type: 'pill',
        options: [
          { value: 'monri', label: 'Monri' },
          { value: 'stripe', label: 'Stripe' },
          { value: 'adyen', label: 'Adyen' },
        ],
      },
      {
        id: 'attemptStatus',
        label: 'Attempt status',
        type: 'pill',
        options: [
          { value: 'pending', label: 'pending' },
          { value: 'succeeded', label: 'succeeded' },
          { value: 'failed', label: 'failed' },
          { value: 'cancelled', label: 'cancelled' },
          { value: 'refunded', label: 'refunded' },
          { value: 'requires_action', label: 'requires_action' },
        ],
      },
      { id: 'hasFailedAttempt', label: 'Has a failed attempt', type: 'tristate' },
      { id: 'failureCode', label: 'Failure code', type: 'text', placeholder: 'e.g. card_declined' },
      { id: 'attemptCount', label: 'Attempt count', type: 'range' },
      { id: 'partialCapture', label: 'Partial capture', type: 'tristate' },
      { id: 'awaitingWebhook', label: 'Awaiting webhook', type: 'tristate', helperText: 'Non-terminal status with webhook_received_at null.' },
      { id: 'voucherApplied', label: 'Voucher applied', type: 'tristate' },
      { id: 'voucherCode', label: 'Voucher code', type: 'text', placeholder: 'Type to match...' },
      { id: 'registeredByStaff', label: 'Registered by staff', type: 'text', placeholder: 'Type to match...', helperText: 'Cash and organizer POS only.' },
      {
        id: 'registeredVia',
        label: 'Registered via',
        type: 'select',
        options: [ANY_OPTION, { value: 'web', label: 'Web' }, { value: 'mobile_app', label: 'Mobile app' }, { value: 'staff_app', label: 'Staff app' }, { value: 'api', label: 'API' }],
      },
    ],
  },
  {
    id: 'settlement',
    label: 'Settlement',
    fields: [
      {
        id: 'settlementTrack',
        label: 'Settlement track',
        type: 'pill',
        options: [
          { value: 'payout', label: 'payout' },
          { value: 'offapp', label: 'offapp' },
        ],
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
        helperText: 'SETTLED shows as PAID on the payout track and FISCALIZED on the off-app track.',
      },
      {
        id: 'batch',
        label: 'Batch',
        type: 'select',
        options: [ANY_OPTION, { value: 'PB-2026-06-30', label: 'PB-2026-06-30' }, { value: 'not-in-a-batch', label: 'Not in a batch' }],
      },
      {
        id: 'batchType',
        label: 'Batch type',
        type: 'pill',
        options: [
          { value: 'payout', label: 'payout' },
          { value: 'offapp', label: 'offapp' },
        ],
      },
      {
        id: 'batchStatus',
        label: 'Batch status',
        type: 'pill',
        options: [
          { value: 'PENDING', label: 'PENDING' },
          { value: 'PAID', label: 'PAID' },
          { value: 'CONFIRMED', label: 'CONFIRMED' },
          { value: 'CANCELLED', label: 'CANCELLED' },
        ],
      },
      { id: 'serviceCompleted', label: 'Service completed', type: 'tristate', helperText: 'No = payout_eligible_at is null.' },
      {
        id: 'exclusionReason',
        label: 'Exclusion reason',
        type: 'pill',
        options: [
          { value: 'REFUNDED', label: 'REFUNDED' },
          { value: 'CHARGEBACK', label: 'CHARGEBACK' },
          { value: 'VOUCHER_FUNDED', label: 'VOUCHER_FUNDED' },
          { value: 'manual', label: 'Manual' },
        ],
        helperText: 'A min-spend reservation is always EXCLUDED with VOUCHER_FUNDED — by design, not an error.',
      },
      {
        id: 'excludedBy',
        label: 'Excluded by',
        type: 'select',
        options: [ANY_OPTION, { value: 'system', label: 'System (automatic)' }, { value: 'superadmin', label: 'Superadmin' }],
      },
      { id: 'crossBorderPayout', label: 'Cross-border payout', type: 'tristate', superAdminOnly: true },
    ],
  },
  {
    id: 'fiscalization',
    label: 'Fiscalization & documents',
    fields: [
      {
        id: 'fiscalizationStatus',
        label: 'Fiscalization status',
        type: 'pill',
        options: [
          { value: 'NOT_FISCALIZED', label: 'NOT_FISCALIZED' },
          { value: 'FISCALIZED', label: 'FISCALIZED' },
          { value: 'FISCALIZATION_FAILED', label: 'FISCALIZATION_FAILED' },
        ],
      },
      {
        id: 'documentStatus',
        label: 'Document status',
        type: 'pill',
        options: [
          { value: 'NOT_GENERATED', label: 'NOT_GENERATED' },
          { value: 'GENERATED', label: 'GENERATED' },
          { value: 'GENERATION_FAILED', label: 'GENERATION_FAILED' },
          { value: 'CANCELLED', label: 'CANCELLED' },
        ],
      },
      {
        id: 'documentTypePresent',
        label: 'Document type present',
        type: 'select',
        options: [ANY_OPTION, { value: 'invoice', label: 'Invoice' }, { value: 'confirmation', label: 'Confirmation' }, { value: 'credit_note', label: 'Credit note' }, { value: 'e_invoice', label: 'e-Invoice' }],
      },
      {
        id: 'invoiceRole',
        label: 'Invoice role',
        type: 'pill',
        options: [
          { value: 'ticketing_service_fee', label: 'ticketing_service_fee', superAdminOnly: true },
          { value: 'ticketing_tickets', label: 'ticketing_tickets' },
          { value: 'subscription', label: 'subscription' },
          { value: 'commission', label: 'commission' },
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
      { id: 'billkoErrors', label: 'Billko errors', type: 'tristate' },
      { id: 'missingFiscalNumber', label: 'Missing fiscal number', type: 'tristate', helperText: 'Invoice exists without a JIR.' },
      {
        id: 'confirmationStatus',
        label: 'Confirmation status',
        type: 'select',
        options: [ANY_OPTION, { value: 'not_sent', label: 'Not sent' }, { value: 'sent', label: 'Sent' }, { value: 'delivered', label: 'Delivered' }, { value: 'bounced', label: 'Bounced' }],
      },
      {
        id: 'emailDelivery',
        label: 'Email delivery',
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
  {
    id: 'money',
    label: 'Money',
    fields: [
      { id: 'grossAmount', label: 'Gross amount', type: 'range', unit: 'EUR' },
      { id: 'organizerNet', label: 'Organizer net', type: 'range', unit: 'EUR' },
      { id: 'pleisNet', label: 'Pleis net', type: 'range', unit: 'EUR', superAdminOnly: true },
      {
        id: 'negativePleisNet',
        label: 'Negative Pleis net',
        type: 'tristate',
        superAdminOnly: true,
        helperText: 'Expected on zero-commission lines — the gateway 1% is absorbed by Pleis.',
      },
      { id: 'serviceFee', label: 'Service fee', type: 'range', unit: 'EUR', superAdminOnly: true },
      { id: 'tip', label: 'Tip', type: 'range', unit: 'EUR' },
      { id: 'commissionRate', label: 'Commission rate', type: 'range', unit: '%', helperText: 'Zero commission is valid — the organizer receives the full amount.' },
      { id: 'gatewayCost', label: 'Gateway cost', type: 'range', unit: 'EUR', superAdminOnly: true },
      { id: 'promoCodeApplied', label: 'Promo code applied', type: 'tristate' },
      { id: 'promoDiscount', label: 'Promo discount', type: 'range', unit: 'EUR' },
    ],
  },
  {
    id: 'subscription',
    label: 'Subscription',
    superAdminOnly: true,
    disabledWhen: (values) => !((values.module as string[] | undefined) || []).includes('subscriptions'),
    disabledHelperText: 'disabled — select the Subscriptions module first',
    fields: [
      {
        id: 'subscribedModule',
        label: 'Subscribed module',
        type: 'pill',
        superAdminOnly: true,
        options: [
          { value: 'ticketing', label: 'ticketing' },
          { value: 'reservations', label: 'reservations' },
          { value: 'ordering', label: 'ordering' },
          { value: 'loyalty', label: 'loyalty' },
          { value: 'advanced_analytics', label: 'advanced_analytics' },
        ],
      },
      {
        id: 'billingTrigger',
        label: 'Billing trigger',
        type: 'pill',
        superAdminOnly: true,
        options: [
          { value: 'initial_purchase', label: 'initial_purchase' },
          { value: 'renewal', label: 'renewal' },
        ],
      },
      { id: 'hasProration', label: 'Has proration', type: 'tristate', superAdminOnly: true },
      {
        id: 'subscriptionStatus',
        label: 'Subscription status',
        type: 'pill',
        superAdminOnly: true,
        options: [
          { value: 'invoiced', label: 'invoiced' },
          { value: 'cancelled', label: 'cancelled' },
          { value: 'refunded', label: 'refunded' },
        ],
      },
      { id: 'organizationCount', label: 'Organization count', type: 'range', superAdminOnly: true },
      { id: 'billingPeriod', label: 'Billing period', type: 'date-range', superAdminOnly: true },
    ],
  },
];

export const isSectionDisabled = (section: FilterSectionDef, values: FilterValues): boolean => Boolean(section.disabledWhen?.(values));

export const getFieldById = (id: string) => FILTER_SECTIONS.flatMap((section) => section.fields).find((field) => field.id === id);
