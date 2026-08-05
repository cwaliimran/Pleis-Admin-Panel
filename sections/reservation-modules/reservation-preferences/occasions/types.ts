// ============================================================
// Occasions — view model
//
// The wire shape lives in `store/Reducer/occasions-api.ts`; `mappers.ts`
// is the only place that knows both.
// ============================================================

export type OccasionStatus = 'active' | 'inactive';

export interface Occasion {
  /** The record's `_id`. */
  id: string;
  /** `name` on the wire. */
  label: string;
  status: OccasionStatus;
}
