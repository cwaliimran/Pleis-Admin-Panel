import { DeliveryOption, DeliveryOptionPayload, OrderTimingSettings, OrderingSettings, PaymentSettings, TipSettings } from './types';

// ============================================================
// TEMPORARY IN-MEMORY BACKEND
//
// Stands in for the ordering-settings API until it ships. It is keyed by
// organizationId so switching organizations behaves like the real thing
// (separate records, edits kept for the lifetime of the tab).
//
// When the real endpoints land, delete this file and rewrite the body of
// `use-ordering-settings.ts` — nothing else imports it.
// ============================================================

const LATENCY_MS = 450;

const delay = (ms = LATENCY_MS) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const uid = () => `mock_${Math.random().toString(36).slice(2, 10)}`;

/** Deep clone so callers can never mutate the store by reference. */
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const buildSeedSettings = (): OrderingSettings => ({
  payment: {
    inAppPayment: true,
    payNow: false,
  },
  tips: {
    enabled: true,
    presets: [
      { id: uid(), unit: 'percentage', value: 5 },
      { id: uid(), unit: 'percentage', value: 10 },
      { id: uid(), unit: 'percentage', value: 15 },
      { id: uid(), unit: 'percentage', value: 20 },
    ],
    allowCustomAmount: true,
  },
  deliveryOptions: [
    { id: uid(), name: 'Counter 1', type: 'counterPickup', status: 'active', qrCodeUrl: null },
    { id: uid(), name: 'Counter 2', type: 'counterPickup', status: 'active', qrCodeUrl: null },
    { id: uid(), name: 'Table 1', type: 'tableDelivery', status: 'active', qrCodeUrl: null },
    { id: uid(), name: 'Table 2', type: 'tableDelivery', status: 'active', qrCodeUrl: null },
    { id: uid(), name: 'Table 3', type: 'tableDelivery', status: 'active', qrCodeUrl: null },
    { id: uid(), name: 'Table 4', type: 'tableDelivery', status: 'inactive', qrCodeUrl: null },
    { id: uid(), name: 'To go', type: 'toGo', status: 'active', qrCodeUrl: null },
  ],
  orderTiming: {
    sessionTimerEnabled: true,
    sessionLengthMinutes: 30,
  },
});

const store = new Map<string, OrderingSettings>();

const read = (organizationId: string): OrderingSettings => {
  if (!store.has(organizationId)) {
    store.set(organizationId, buildSeedSettings());
  }
  return store.get(organizationId) as OrderingSettings;
};

export const mockOrderingSettingsApi = {
  async get(organizationId: string): Promise<OrderingSettings> {
    await delay();
    return clone(read(organizationId));
  },

  async updatePayment(organizationId: string, payment: PaymentSettings): Promise<PaymentSettings> {
    await delay();
    const settings = read(organizationId);
    settings.payment = clone(payment);
    return clone(settings.payment);
  },

  async updateTips(organizationId: string, tips: TipSettings): Promise<TipSettings> {
    await delay();
    const settings = read(organizationId);
    settings.tips = clone(tips);
    return clone(settings.tips);
  },

  async updateOrderTiming(organizationId: string, orderTiming: OrderTimingSettings): Promise<OrderTimingSettings> {
    await delay();
    const settings = read(organizationId);
    settings.orderTiming = clone(orderTiming);
    return clone(settings.orderTiming);
  },

  async createDeliveryOption(organizationId: string, payload: DeliveryOptionPayload): Promise<DeliveryOption[]> {
    await delay();
    const settings = read(organizationId);
    settings.deliveryOptions.push({ id: uid(), qrCodeUrl: null, ...payload });
    return clone(settings.deliveryOptions);
  },

  async updateDeliveryOption(organizationId: string, id: string, payload: DeliveryOptionPayload): Promise<DeliveryOption[]> {
    await delay();
    const settings = read(organizationId);
    settings.deliveryOptions = settings.deliveryOptions.map((option) => (option.id === id ? { ...option, ...payload } : option));
    return clone(settings.deliveryOptions);
  },

  async deleteDeliveryOption(organizationId: string, id: string): Promise<DeliveryOption[]> {
    await delay();
    const settings = read(organizationId);
    settings.deliveryOptions = settings.deliveryOptions.filter((option) => option.id !== id);
    return clone(settings.deliveryOptions);
  },

  async generateDeliveryOptionQrCode(organizationId: string, id: string): Promise<DeliveryOption[]> {
    await delay();
    const settings = read(organizationId);
    settings.deliveryOptions = settings.deliveryOptions.map((option) =>
      option.id === id ? { ...option, qrCodeUrl: `https://mock.pleis.app/qr/${organizationId}/${id}.png` } : option
    );
    return clone(settings.deliveryOptions);
  },
};
