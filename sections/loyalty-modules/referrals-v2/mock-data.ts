import { Referral, ReferralSettings, ReferralStats } from './types';

/**
 * Placeholder dataset for Referrals V2. Replace with the real endpoints once
 * they exist — nothing outside `use-referrals-view.ts` reads this.
 */

export const MOCK_REFERRAL_SETTINGS: ReferralSettings = {
  pointsPerReferral: 100,
  referralLimitPerUser: 10,
};

/**
 * Aggregates across every referral — deliberately not derived from
 * `MOCK_REFERRALS`, which is only the loaded page. In production these come
 * from the stats endpoint.
 */
export const MOCK_REFERRAL_STATS: ReferralStats = {
  completed: 47,
  pending: 6,
  pointsGiven: 9400,
  topReferrer: { username: 'marko_z', referrals: 9 },
};

export const MOCK_REFERRALS: Referral[] = [
  {
    id: 'ref-1',
    user: 'ivana_p',
    referrer: 'marko_z',
    refLimit: 10,
    refCount: 9,
    userPoints: 100,
    referrerPoints: 100,
    createdAt: '2026-03-02',
    expiryDate: '2026-03-17',
    status: 'completed',
  },
  {
    // Points stay at zero until the referral completes.
    id: 'ref-2',
    user: 'petar_k',
    referrer: 'marko_z',
    refLimit: 10,
    refCount: 9,
    userPoints: 0,
    referrerPoints: 0,
    createdAt: '2026-03-09',
    expiryDate: '2026-03-24',
    status: 'pending',
  },
  {
    id: 'ref-3',
    user: 'sara_m',
    referrer: 'luka_92',
    refLimit: 10,
    refCount: 3,
    userPoints: 0,
    referrerPoints: 0,
    createdAt: '2026-02-14',
    expiryDate: '2026-03-01',
    status: 'cancelled',
  },
];
