export type PaymentTimingType = 'acceptance' | 'delivery';

export type DeliveryMethodType = 'counter' | 'table' | 'togo';

export interface PaymentMethodSettings {
  instant: boolean;
  payLater: boolean;
  cash: boolean;
}

export interface OrderAcceptanceSettings {
  enabled: boolean;
  paymentTiming: PaymentTimingType;
}

export interface DeliveryMethodSettings {
  counter: boolean;
  table: boolean;
  togo: boolean;
}

export interface OrderingSettings {
  payment: PaymentMethodSettings;
  acceptance: OrderAcceptanceSettings;
  delivery: DeliveryMethodSettings;
}

export interface DeliveryMethod {
  id: DeliveryMethodType;
  icon: string;
  title: string;
  description: string;
}

export interface PaymentTimingOption {
  value: PaymentTimingType;
  label: string;
  description: string;
}