// Page entry point
export { OrderingSettingsViewV2 } from './ordering-settings-view';

// Shared types
export * from './types';

// Document seams — each is shared by the sections that live in that record
export { useOrderingSettingsRecord } from './use-ordering-settings-record';
export { useOrganizationOrderingSettings } from './use-organization-ordering-settings';

// Sections
export * from './common';
export * from './delivery-options';
export * from './order-acceptance';
export * from './order-timing';
export * from './payment-methods';
export * from './tips';
