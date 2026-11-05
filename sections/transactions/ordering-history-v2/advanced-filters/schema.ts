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
        id: 'deliveryLocation',
        label: 'Delivery location',
        type: 'select',
        options: [ANY_OPTION, { value: 'stol-1', label: 'Stol 1' }, { value: 'stol-2', label: 'Stol 2' }, { value: 'sank', label: 'Šank' }],
      },
      { id: 'timeOfDay', label: 'Time of day', type: 'range', unit: 'h', helperText: 'Range on the clock, independent of the date range.' },
    ],
  },
  {
    id: 'order',
    label: 'Order',
    fields: [
      {
        id: 'status',
        label: 'Status',
        type: 'pill',
        options: [
          { value: 'sent', label: 'sent' },
          { value: 'preparing', label: 'preparing' },
          { value: 'delivered', label: 'delivered' },
          { value: 'awaiting_payment', label: 'awaiting_payment' },
          { value: 'paid', label: 'paid' },
          { value: 'rejected', label: 'rejected' },
          { value: 'cancelled', label: 'cancelled' },
        ],
      },
      {
        id: 'paymentType',
        label: 'Payment type',
        type: 'pill',
        options: [
          { value: 'pay_now', label: 'pay_now' },
          { value: 'pay_later', label: 'pay_later' },
          { value: 'cash_at_venue', label: 'cash_at_venue' },
        ],
      },
      {
        id: 'deliveryMethod',
        label: 'Delivery method',
        type: 'pill',
        options: [
          { value: 'counter_pickup', label: 'counter_pickup' },
          { value: 'table_delivery', label: 'table_delivery' },
          { value: 'to_go', label: 'to_go' },
        ],
      },
      { id: 'round', label: 'Round', type: 'select', options: [ANY_OPTION, { value: 'first', label: 'First order' }, { value: 'later', label: 'Later round' }] },
      { id: 'linkedReservation', label: 'Linked reservation', type: 'tristate' },
      { id: 'orderReference', label: 'Order reference', type: 'text', placeholder: 'Partial match' },
      { id: 'itemCount', label: 'Item count', type: 'range' },
      { id: 'hasGuestNote', label: 'Has guest note', type: 'tristate' },
      { id: 'loyaltyPointsAwarded', label: 'Loyalty points awarded', type: 'tristate' },
    ],
  },
  {
    id: 'staff',
    label: 'Staff',
    fields: [
      { id: 'handledBy', label: 'Handled by', type: 'text', placeholder: 'The waiter' },
      {
        id: 'handledVia',
        label: 'Handled via',
        type: 'select',
        options: [ANY_OPTION, { value: 'mobile_staff_app', label: 'Mobile staff app' }, { value: 'web_admin_app', label: 'Web admin app' }],
      },
      { id: 'cancelledBy', label: 'Cancelled by', type: 'text', placeholder: 'Type to match...' },
      {
        id: 'cancelReason',
        label: 'Cancel or reject reason',
        type: 'pill',
        options: [
          { value: 'item_out_of_stock', label: 'item_out_of_stock' },
          { value: 'venue_busy_or_closing', label: 'venue_busy_or_closing' },
          { value: 'customer_request', label: 'customer_request' },
          { value: 'customer_not_found_at_table', label: 'customer_not_found_at_table' },
          { value: 'other', label: 'other' },
        ],
      },
      { id: 'hasReasonNote', label: 'Has reason note', type: 'tristate' },
      { id: 'customerNotified', label: 'Customer notified', type: 'tristate' },
    ],
  },
  {
    id: 'money',
    label: 'Money',
    fields: [
      {
        id: 'orderTotal',
        label: 'Order total',
        type: 'range',
        unit: 'EUR',
        helperText: 'Covers the round. The transaction gross covers the whole pay-later tab.',
      },
      { id: 'subtotal', label: 'Subtotal', type: 'range', unit: 'EUR' },
      { id: 'hasDiscount', label: 'Has discount', type: 'range', unit: 'EUR' },
      { id: 'voucherApplied', label: 'Voucher applied', type: 'range', unit: 'EUR' },
      { id: 'voucherReleased', label: 'Voucher released', type: 'range', unit: 'EUR', helperText: 'Returned to the balance on cancel or reject.' },
      { id: 'tip', label: 'Tip', type: 'range', unit: 'EUR' },
      { id: 'tipCommissionRate', label: 'Tip commission rate', type: 'range', unit: '%' },
      { id: 'taxTotal', label: 'Tax total', type: 'range', unit: 'EUR' },
      {
        id: 'taxLabelPresent',
        label: 'Tax label present',
        type: 'pill',
        options: [
          { value: 'Tg0', label: 'Tg0' },
          { value: 'Tg1', label: 'Tg1' },
          { value: 'Tg2', label: 'Tg2' },
          { value: 'Tg3', label: 'Tg3' },
          { value: 'Tg4', label: 'Tg4' },
        ],
      },
    ],
  },
  {
    id: 'items',
    label: 'Items · EXISTS on order lines',
    fields: [
      { id: 'menuItem', label: 'Menu item', type: 'select', options: [ANY_OPTION] },
      { id: 'menuList', label: 'Menu list', type: 'select', options: [ANY_OPTION] },
      { id: 'venueSubcategory', label: 'Venue subcategory', type: 'select', options: [ANY_OPTION] },
      {
        id: 'presetCategory',
        label: 'Preset category',
        type: 'pill',
        options: [
          { value: 'HRANA', label: 'HRANA' },
          { value: 'PIĆA', label: 'PIĆA' },
          { value: 'OSTALO', label: 'OSTALO' },
        ],
      },
      { id: 'presetSubcategory', label: 'Preset subcategory', type: 'select', options: [ANY_OPTION] },
      { id: 'presetType', label: 'Preset type', type: 'select', options: [ANY_OPTION] },
      { id: 'brand', label: 'Brand', type: 'select', options: [ANY_OPTION] },
      { id: 'brandPrincipal', label: 'Brand principal', type: 'select', options: [ANY_OPTION] },
      {
        id: 'cuisine',
        label: 'Cuisine',
        type: 'pill',
        options: [
          { value: 'italian', label: 'italian' },
          { value: 'dalmatian', label: 'dalmatian' },
          { value: 'fusion', label: 'fusion' },
        ],
      },
      { id: 'serving', label: 'Serving', type: 'select', options: [ANY_OPTION] },
      {
        id: 'dietTags',
        label: 'Diet tags',
        type: 'pill',
        options: [
          { value: 'vegetarian', label: 'vegetarian' },
          { value: 'vegan', label: 'vegan' },
          { value: 'gluten_free', label: 'gluten_free' },
        ],
      },
      {
        id: 'allergens',
        label: 'Allergens · EU 1169/2011',
        type: 'pill',
        options: [
          { value: 'gluten', label: 'gluten' },
          { value: 'milk', label: 'milk' },
          { value: 'eggs', label: 'eggs' },
          { value: 'nuts', label: 'nuts' },
          { value: 'soy', label: 'soy' },
          { value: 'celery', label: 'celery' },
        ],
      },
      {
        id: 'daypart',
        label: 'Daypart',
        type: 'pill',
        options: [
          { value: 'morning', label: 'morning' },
          { value: 'afternoon', label: 'afternoon' },
          { value: 'evening', label: 'evening' },
          { value: 'late_night', label: 'late_night' },
        ],
      },
      { id: 'combo', label: 'Combo', type: 'select', options: [ANY_OPTION] },
      {
        id: 'itemStatus',
        label: 'Item status',
        type: 'pill',
        options: [
          { value: 'sent', label: 'sent' },
          { value: 'preparing', label: 'preparing' },
          { value: 'delivered', label: 'delivered' },
          { value: 'awaiting_payment', label: 'awaiting_payment' },
          { value: 'paid', label: 'paid' },
          { value: 'rejected', label: 'rejected' },
          { value: 'cancelled', label: 'cancelled' },
        ],
      },
      { id: 'tipLine', label: 'Tip line', type: 'select', options: [ANY_OPTION] },
      { id: 'toGoAllowed', label: 'To-go allowed', type: 'tristate' },
      { id: 'confirmationRequired', label: 'Confirmation required', type: 'tristate' },
      { id: 'posItemId', label: 'POS item ID', type: 'text', placeholder: 'Organizer-side reconciliation' },
    ],
  },
  {
    id: 'discounts',
    label: 'Discounts',
    fields: [
      {
        id: 'discountSource',
        label: 'Discount source',
        type: 'pill',
        options: [
          { value: 'menu_discount', label: 'menu_discount' },
          { value: 'loyalty_item_on_discount', label: 'loyalty_item_on_discount' },
          { value: 'promo_code_checkout', label: 'promo_code_checkout' },
          { value: 'combo_allocation', label: 'combo_allocation' },
          { value: 'manual_staff', label: 'manual_staff' },
        ],
      },
      {
        id: 'discountType',
        label: 'Discount type',
        type: 'pill',
        options: [
          { value: 'percentage', label: 'percentage' },
          { value: 'fixed_amount', label: 'fixed_amount' },
        ],
      },
      { id: 'specificDiscount', label: 'Specific discount or promotion', type: 'select', options: [ANY_OPTION] },
      { id: 'amountOff', label: 'Amount off', type: 'range', unit: 'EUR' },
    ],
  },
  {
    id: 'settlementDocuments',
    label: 'Settlement & documents',
    fields: [
      {
        id: 'settlementTrack',
        label: 'Settlement track',
        type: 'pill',
        options: [
          { value: 'payout', label: 'payout' },
          { value: 'offapp', label: 'offapp' },
        ],
        helperText: 'Cash and organizer POS orders route off-app — the settlement filters still apply, they just carry different values.',
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
        id: 'batch',
        label: 'Batch',
        type: 'select',
        options: [ANY_OPTION, { value: 'PB-2026-06-30', label: 'PB-2026-06-30' }, { value: 'not-in-a-batch', label: 'Not in a batch' }],
      },
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
        id: 'confirmationStatus',
        label: 'Confirmation status',
        type: 'select',
        options: [ANY_OPTION, { value: 'not_sent', label: 'Not sent' }, { value: 'sent', label: 'Sent' }, { value: 'delivered', label: 'Delivered' }],
      },
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
