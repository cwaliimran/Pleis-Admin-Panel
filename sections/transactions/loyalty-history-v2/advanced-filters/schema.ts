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
        id: 'loyaltyScope',
        label: 'Loyalty scope',
        type: 'pill',
        options: [
          { value: 'local', label: 'Local' },
          { value: 'global', label: 'Global' },
        ],
      },
      {
        id: 'loyaltyClub',
        label: 'Loyalty club · local entries only',
        type: 'select',
        options: [ANY_OPTION, { value: 'pleis-cabaret-club', label: 'PLEIS Cabaret Club' }],
      },
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
        id: 'includeEntriesWithNoVenue',
        label: 'Include entries with no venue',
        type: 'tristate',
        helperText: 'Global challenge and badge earnings have no organization — do not drop them silently.',
      },
    ],
  },
  {
    id: 'entry',
    label: 'Entry',
    fields: [
      {
        id: 'entryType',
        label: 'Entry type',
        type: 'pill',
        options: [
          { value: 'earn', label: 'earn' },
          { value: 'spend', label: 'spend' },
          { value: 'reward_grant', label: 'reward_grant' },
          { value: 'expire', label: 'expire' },
          { value: 'manual_adjustment', label: 'manual_adjustment' },
          { value: 'reversal', label: 'reversal' },
        ],
      },
      {
        id: 'sourceType',
        label: 'Source type',
        type: 'pill',
        options: [
          { value: 'purchase', label: 'purchase' },
          { value: 'challenge', label: 'challenge' },
          { value: 'streak', label: 'streak' },
          { value: 'referral', label: 'referral' },
          { value: 'badge', label: 'badge' },
          { value: 'reservation_bonus', label: 'reservation_bonus' },
          { value: 'manual_gift', label: 'manual_gift' },
          { value: 'reward_redemption', label: 'reward_redemption' },
          { value: 'expiration', label: 'expiration' },
          { value: 'order_cancelled', label: 'order_cancelled' },
          { value: 'bonus_correction', label: 'bonus_correction' },
        ],
      },
      {
        id: 'earningMode',
        label: 'Earning mode',
        type: 'pill',
        options: [
          { value: 'seeded_by_local', label: 'seeded_by_local' },
          { value: 'direct', label: 'direct' },
        ],
      },
      { id: 'hasTransaction', label: 'Has a transaction', type: 'tristate' },
      { id: 'hasPairedEntry', label: 'Has a paired entry', type: 'tristate' },
      {
        id: 'specificSource',
        label: 'Source · challenge, streak, badge, referral',
        type: 'select',
        options: [ANY_OPTION, { value: 'first-reservation-badge', label: 'Badge: First reservation' }, { value: 'summer-streak', label: 'Streak: Summer visits' }, { value: 'five-visits-challenge', label: 'Challenge: 5 visits in a month' }],
      },
      { id: 'description', label: 'Description', type: 'text', placeholder: 'Partial match' },
    ],
  },
  {
    id: 'points',
    label: 'Points',
    fields: [
      { id: 'pointsChange', label: 'Points change', type: 'range', unit: 'pts', helperText: 'Positive, Negative and Zero selectable on their own — a reward grant moves zero points.' },
      { id: 'basePoints', label: 'Base points', type: 'range', unit: 'pts' },
      { id: 'billAmount', label: 'Bill amount', type: 'range', unit: 'EUR' },
      { id: 'hasPromotion', label: 'Has a promotion', type: 'tristate' },
      {
        id: 'promotionType',
        label: 'Promotion type',
        type: 'pill',
        options: [
          { value: 'extra_points_for_item', label: 'extra_points_for_item' },
          { value: 'happy_hour', label: 'happy_hour' },
        ],
      },
      {
        id: 'specificPromotion',
        label: 'Specific promotion',
        type: 'select',
        options: [ANY_OPTION, { value: 'happy-hour-1-5x', label: 'Happy Hour ×1.5' }, { value: 'extra-points-cocktails', label: 'Extra points · cocktails' }],
      },
      { id: 'promotionContribution', label: 'Promotion contribution', type: 'range', unit: 'pts' },
      {
        id: 'tierAtTime',
        label: 'Tier at the time',
        type: 'select',
        options: [ANY_OPTION, { value: 'bronze', label: 'Bronze' }, { value: 'vip-i', label: 'VIP I' }, { value: 'vip-ii', label: 'VIP II' }],
      },
      {
        id: 'statusAtTime',
        label: 'Global status at the time',
        type: 'select',
        options: [ANY_OPTION, { value: 'silver', label: 'Silver' }, { value: 'gold', label: 'Gold' }],
      },
      { id: 'tierBonus', label: 'Tier bonus', type: 'range', unit: '1–5' },
      { id: 'statusBonus', label: 'Status bonus', type: 'range', unit: '1–5' },
      { id: 'capApplied', label: 'Cap applied', type: 'tristate', helperText: 'Base points hit the 20 per EUR ceiling.' },
      { id: 'balanceAfter', label: 'Balance after', type: 'range', unit: 'pts' },
    ],
  },
  {
    id: 'rewards',
    label: 'Rewards',
    fields: [
      {
        id: 'rewardSource',
        label: 'Reward source',
        type: 'pill',
        options: [
          { value: 'points_redemption', label: 'points_redemption' },
          { value: 'challenge', label: 'challenge' },
          { value: 'streak', label: 'streak' },
          { value: 'manual_gift', label: 'manual_gift' },
        ],
      },
      {
        id: 'specificReward',
        label: 'Specific reward',
        type: 'select',
        options: [ANY_OPTION, { value: 'aperol-spritz', label: 'Aperol Spritz' }, { value: 'free-entry-nokturno', label: 'Free entry · Nokturno' }],
      },
      {
        id: 'rewardKind',
        label: 'Reward kind',
        type: 'pill',
        options: [
          { value: 'internal', label: 'Internal' },
          { value: 'third_party', label: 'Third-party partner' },
        ],
      },
      { id: 'qrIssued', label: 'QR issued', type: 'tristate' },
      {
        id: 'collection',
        label: 'Collection',
        type: 'select',
        options: [ANY_OPTION, { value: 'collected', label: 'Collected' }, { value: 'uncollected', label: 'Uncollected' }],
      },
      { id: 'collectedBy', label: 'Collected by', type: 'text', placeholder: 'Type to match...' },
      {
        id: 'collectedVia',
        label: 'Collected via',
        type: 'select',
        options: [ANY_OPTION, { value: 'web_admin_app', label: 'Web admin app' }, { value: 'mobile_staff_app', label: 'Mobile staff app' }],
      },
    ],
  },
  {
    id: 'user',
    label: 'User',
    fields: [
      { id: 'user', label: 'User', type: 'text', placeholder: 'Type to match...' },
      { id: 'userSearch', label: 'User search', type: 'text', placeholder: 'Name, surname or email' },
    ],
  },
];

export const isSectionDisabled = (section: FilterSectionDef, values: FilterValues): boolean => Boolean(section.disabledWhen?.(values));

export const getFieldById = (id: string) => FILTER_SECTIONS.flatMap((section) => section.fields).find((field) => field.id === id);
