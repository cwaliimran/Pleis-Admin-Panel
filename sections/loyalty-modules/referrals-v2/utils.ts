import { ReferralSettings } from './types';

/** Renders as "100 pts · cap 10 / user" for the Current Settings tile. */
export const formatSettingsSummary = (settings: ReferralSettings): string =>
  `${settings.pointsPerReferral.toLocaleString()} pts · cap ${settings.referralLimitPerUser.toLocaleString()} / user`;
