export const API_ROUTES = {
  // ── AUTH ROUTES (Authentication & Public) ───────────────────────────────
  CHECK_EMAIL_EXISTS: `/auth/check-email-exists`,
  REGISTER: `/auth/register`,
  SOCIAL_AUTH: `/auth/social-auth`,
  LOGIN: `/auth/login`,
  RESEND_OTP: `/auth/link/send-password-reset`,
  VERIFY_OTP: `/auth/verify-otp/email`,
  RESET_PASSWORD: `/auth/link/reset-password`,
  RESUME_ACCOUNT: `/auth/resume-account`,
  CHANGE_PASSWORD: `/auth/change-password`,

  TWO_FACTOR_AUTH_SETUP: `/admin/users/twofa/setup`,
  TWO_FACTOR_AUTH_CONFIRM: `/admin/users/twofa/confirm`,
  TWO_FACTOR_AUTH_DISABLE: `/admin/users/twofa/disable`,

  ORGANIZER_TWO_FACTOR_AUTH_SETUP: `/organizer/users/twofa/setup`,
  ORGANIZER_TWO_FACTOR_AUTH_CONFIRM: `/organizer/users/twofa/confirm`,
  ORGANIZER_TWO_FACTOR_AUTH_DISABLE: `/organizer/users/twofa/disable`,

  UPDATE_TERMS: (id: string) => `/organizer/users/${id}`,

  // ── SIMPLE / USER ROUTES ───────────────────────────────────
  TERMSANDCONDITION: `/settings/terms-conditions`,
  TERMSANDCONDITION_CUSTOMER: `/settings/customer-terms-conditions`,
  TERMSANDCONDITION_PRIVACY_POLICY: `/settings/privacy-policy`,
  CREATE_SETTINGS: `/settings/create`,
  TERMSANDCONDITION_BY_ID: (id: string) => `/settings/update/${id}`,

  SUPPLIERS_GLOABAL: `/suppliers/global`,

  VENUES: `/venues`,
  VENUES_BY_ID: (id: string) => `/venues/${id}`,

  ORGANIZATION: `/organizer/organizations`,
  ORGANIZATION_BY_ID: (id: string) => `/organizer/organizations/${id}`,

  ORGANIZATION_ALL: `/organizer/organizations/all`,

  UPDATES: `/organizer/updates`,
  UPDATES_BY_ID: (id: string) => `/organizer/updates/${id}`,
  GET_EVENT_BY_MULTIPLE_ORGANIZATION: `/organizer/updates/events`,

  ORGANIZER_GENERAL_ORGANIZATIONS: `/organizer/general/organizations`,

  USER_LIST: `/users`,
  USER_LIST_BY_ID: (id: string) => `/users/${id}`,
  PENDING_USER_LIST_BY_ID: (id: string) => `/users/${id}`,

  HIGHLIGHT_LIST: `/highlights`,
  HIGHLIGHT_LIST_BY_ID: (id: string) => `/highlights/${id}`,

  EVENTS: `/events`,
  EVENTS_BY_ID: (id: string) => `/events/${id}`,

  PRESET: `/menu/presets`,
  PRESET_BY_ID: (id: string) => `/menu/presets/${id}`,

  MENU_CATEGORIES: `/menu/categories`,
  MENU_CATEGORIES_BY_ID: (id: string) => `/menu/categories/${id}`,

  MENU: `/menu`,
  MENU_BY_ID: (id: string) => `/menu/${id}`,
  MENU_DUPLICATE_BY_ID: (id: string) => `/menu/duplicate/${id}`,

  MENU_ITEMS: `/menu/items`,
  MENU_ITEMS_BY_ID: (id: string) => `/menu/items/${id}`,

  LOYALTY_REWARDS: `/loyalty/rewards`,
  LOYALTY_REWARDS_BY_ID: (id: string) => `/loyalty/rewards/${id}`,

  LOYALTY_PROMOTION: `/loyalty/promotions`,
  LOYALTY_PROMOTION_BY_ID: (id: string) => `/loyalty/promotions/${id}`,

  ORGANIZER_REVIEWS: `/organizer/reviews`,

  LOYALTY_CHALLENGE: `/loyalty/challenges`,
  LOYALTY_CHALLENGE_BY_ID: (id: string) => `/loyalty/challenges/${id}`,

  ORGANIZER_GIVEAWAYS: `/organizer/giveaways`,
  ORGANIZER_GIVEAWAYS_WINNERS: `/organizer/giveaways/winners`,
  ORGANIZER_GIVEAWAYS_BY_ID: (id: string) => `/organizer/giveaways/${id}`,
  ORGANIZER_GIVEAWAYS_EVENTS: `/organizer/giveaways/events`,
  ORGANIZER_GIVEAWAYS_EVENTS_TICKETS: `/organizer/giveaways/tickets`,

  GET_ORGANIZER_SUBSCRIPTION: `/organizer/subscriptions`,
  GET_ORGANIZER_OWN_SUBSCRIPTION: `/organizer/subscriptions/user`,
  // UPDATE_ORGANIZER_SUBSCRIPTION_BY_ID: (id: string) => `/organizer/subscriptions/${id}`,

  // ── ADMIN ROUTES ─────────────────────────────────

  ADMIN_RESERVATION_CALENDAR: `/admin/reservations/calendar`,
  ADMIN_RESERVATION_COPY: `/admin/reservations/copy`,
  ADMIN_RESERVATION_CHANGE_TIMING: `/admin/reservations/change-timing`,
  ADMIN_RESERVATION_COPY_SLOTS: `/admin/reservations/copy-slots`,

  ADMIN_ORGANIZATION: `/admin/organizations`,
  ADMIN_ORGANIZATION_BY_ID: (id: string) => `/admin/organizations/${id}`,
  ADMIN_ORGANIZATION_BY_COMPANY_ORGANIZER: (id: string) => `/admin/organizations/names/by-company-organizer/${id}`,

  ADMIN_NOTIFICATIONS: `/admin/notifications`,
  ADMIN_NOTIFICATIONS_GET_ALL: `/admin/notifications/all`,
  ADMIN_NOTIFICATIONS_BY_ID: (id: string) => `/admin/notifications/${id}`,
  ADMIN_GET_ALL_ORGANIZATIONS: `/admin/notifications/organizations`,
  ADMIN_GET_ALL_EVENTS: `/admin/notifications/events`,
  ADMIN_GET_ALL_INTEREST_TAGS: `/admin/notifications/tags`,

  ADMIN_ORDER_MANAGEMENT_GET: `/admin/in-app-ordering/ordermanagement`,
  ADMIN_ORDER_MANAGEMENT_UPDATE: (id: string) => `/admin/in-app-ordering/ordermanagement/${id}`,

  ADMIN_MENU_MANAGEMENT_GET: `/admin/in-app-ordering/menu-management`,
  ADMIN_MENU_MANAGEMENT_CREATE_SALE: `/admin/in-app-ordering/menu-management/sale`,
  ADMIN_MENU_MANAGEMENT_CATEGORIES: `/admin/in-app-ordering/menu-management/menu-item-categories`,
  ADMIN_GET_MENU_ITEMS_BY_ORG: `/admin/in-app-ordering/menu-management/menu-items`,
  ADMIN_ADD_LIMITED_TIME_ITEMS: `/admin/in-app-ordering/menu-management/limited-time`,
  ADMIN_GET_SALE_ITEMS: `/admin/in-app-ordering/menu-management/sale`,
  // ADMIN_MENU_MANAGEMENT_LIMITED_TIME: `/admin/in-app-ordering/menu-management/limited-time`,
  // ADMIN_MENU_MANAGEMENT_UPDATE: (id: string) => `/admin/menu/items/${id}`,

  ADMIN_ORDER_MANAGEMENT_STATUS: `/admin/in-app-ordering/ordermanagement/update`,
  ADMIN_ORDER_MANAGEMENT_STATUS_BY_ID: (id: string) => `/admin/in-app-ordering/ordermanagement/update/${id}`,

  ADMIN_UPDATES: `/admin/updates`,
  ADMIN_UPDATES_BY_ID: (id: string) => `/admin/updates/${id}`,

  ADMIN_FAQS: `/admin/faqs`,
  ADMIN_FAQS_BY_ID: (id: string) => `/admin/faqs/${id}`,

  ADMIN_HELP_SUPPORT: `/admin/support`,
  ADMIN_HELP_SUPPORT_BY_ID: (id: string) => `/admin/support/${id}`,

  // ADMIN_REVIEWS: `/admin/reviews`,
  ADMIN_REVIEWS: (userType: string) => (userType === 'super-admin' ? '/admin/reviews' : '/organizer/reviews'),
  ADMIN_REVIEWS_BY_ID: (id: string) => `/admin/reviews/${id}`,

  ADMIN_TAG_TYPE: `/admin/tags-types`,
  ADMIN_TAG_TYPE_BY_ID: (id: string) => `/admin/tags-types/${id}`,

  ADMIN_QR_CODE: `/admin/qr-code`,
  ADMIN_QR_CODE_BY_ID: (id: string) => `/admin/qr-code/${id}`,

  ADMIN_GIVEAWAYS: `/admin/giveaways`,
  ADMIN_GIVEAWAYS_WINNERS: `/admin/giveaways/winners`,
  ADMIN_GIVEAWAYS_BY_ID: (id: string) => `/admin/giveaways/${id}`,
  ADMIN_GIVEAWAYS_EVENTS: `/admin/giveaways/events`,

  ADMIN_USERS_SUBSCRIPTION: `/admin/subscriptions/users`,
  ADMIN_DELETE_USERS_SUBSCRIPTION_BY_ID: (id: string) => `/admin/subscriptions/${id}`,
  ADMIN_UPDATE_USERS_SUBSCRIPTION_BY_ID: (userId: string) => `/admin/subscriptions/users/${userId}`,

  ADMIN_SUBSCRIPTION_PRICING: `/admin/subscriptions`,
  ADMIN_UPDATE_SUBSCRIPTION_PRICING_BY_ID: (id: string) => `/admin/subscriptions/${id}`,

  ADMIN_EVENTS: `/admin/events`,
  ADMIN_EVENTS_BY_ID: (id: string) => `/admin/events/${id}`,
  // ADMIN_EVENTS_BY_ID: (id: string) => `/admin/events/${id}?scope=future`,

  UPDATE_ADMIN_EVENTS_BY_ID: (id: string) => `/admin/events/${id}`,
  UPDATE_ADMIN_EVENTS_BY_ID_AND_SCOPE: (id: string, scope: string) => `/admin/events/${id}?scope=${scope}`,

  DELETE_ADMIN_EVENTS_BY_ID_AND_SCOPE: (id: string, scope: string) => `/admin/events/${id}?scope=${scope}`,

  ADMIN_EVENTS_BY_ORGANIZATION: (organizationId: string) => `/admin/events/organization/${organizationId}`,

  ADMIN_EVENTS_ANALYTICS_BY_ID: (id: string) => `/admin/events/${id}/analytics`,
  ADMIN_EVENTS_TICKETS_ANALYTICS_BY_ID: (id: string) => `/admin/events/${id}/tickets-analytics`,
  ADMIN_EVENTS_NOTIFICATIONS_BY_ID: (id: string) => `/admin/events/${id}/notifications`,
  ADMIN_EVENTS_FEEDBACK_BY_ID: (id: string) => `/admin/events/${id}/ratting`,

  ADMIN_VENUES: `/admin/venues`,
  ADMIN_VENUES_BY_COMPANY_ORGANIZER: `/admin/venues/title`,
  ADMIN_VENUES_BY_ID: (id: string) => `/admin/venues/${id}`,

  ORGANIZER_VENUES: `/organizer/venues`,
  ORGANIZER_VENUES_BY_ID: (id: string) => `/organizer/venues/${id}`,

  ADMIN_BUNDLES: `/admin/bundles`,
  ADMIN_BUNDLES_BY_ID: (id: string) => `/admin/bundles/${id}`,

  CREATE_MARKETING_REQUEST: `/organizer/marketing`,
  MARKETING_REQUEST: (userType: string) => (userType === 'super-admin' ? '/admin/marketing' : '/organizer/marketing'),

  MARKETING_REQUEST_BY_ID: (id: string) => `/admin/marketing/${id}`,
  MARKETING_REQUEST_BY_ID_UPDATE: (id: string, status: string) => `/admin/marketing/${id}?status=${status || ''}`,

  ADMIN_GLOBAL_REWARD_CATEGORIES: `/admin/global-loyalty/reward-categories`,
  ADMIN_GLOBAL_REWARD_CATEGORIES_MINI: `/admin/global-loyalty/reward-categories/summary`,
  ADMIN_GLOBAL_REWARD_CATEGORIES_BY_ID: (id: string) => `/admin/global-loyalty/reward-categories/${id}`,

  ADMIN_GLOBAL_LOYALTY_STATUS_LEVEL: `/admin/global-loyalty/status-levels`,
  ADMIN_GLOBAL_LOYALTY_STATUS_LEVEL_BY_ID: (id: string) => `/admin/global-loyalty/status-levels/${id}`,

  ORGANIZER_VENUES_TYPES: `/organizer/venue-types`,
  ORGANIZER_VENUES_TYPE_BY_ID: (id: string) => `/organizer/venue-types/${id}`,

  VENUES_TYPES: `/admin/venue-types`,
  VENUES_TYPE_By_ID: (id: string) => `/admin/venue-types/${id}`,

  ADMIN_HIGHLIGHT_LIST: `/admin/highlights`,
  ADMIN_HIGHLIGHT_LIST_BY_ID: (id: string) => `/admin/highlights/${id}`,

  CATEGORIES: `/admin/categories`,
  CATEGORIES_BY_ID: (id: string) => `/admin/categories/${id}`,

  LOYALTY_LISTINGS: `/admin/loyalty/listings`,
  ADMIN_REQUEST_LOYALTY_CLUBS: `/admin/loyalty/club-collaborations`,
  ADMIN_REQUEST_LOYALTY_CLUBS_BY_ID: (id: string) => `/admin/loyalty/club-collaborations/${id}`,
  GET_ADMIN_REQUEST_LOYALTY_CLUBS: (companyOrganizer: string) => `/admin/loyalty/club-collaborations/${companyOrganizer}`,

  // ADMIN_LOYALTY_REWARDS: `/admin/loyalty/rewards`,
  // ADMIN_LOYALTY_REWARDS_BY_ID: (id: string) => `/admin/loyalty/rewards/${id}`,

  ADMIN_POINT_CAL: `/admin/loyalty/points-calculator`,
  ADMIN_LOYALTY_REWARDS: (isGlobal: boolean) => (isGlobal ? '/admin/global-loyalty/reward' : '/admin/loyalty/rewards'),
  ADMIN_LOYALTY_REWARDS_BY_ID: (id: string, isGlobal: boolean) => (isGlobal ? `/admin/global-loyalty/reward/${id}` : `/admin/loyalty/rewards/${id}`),

  ADMIN_GLOBAL_REFERRALS_SETTING: `/admin/global-loyalty/referrals`,
  ADMIN_GLOBAL_REFERRALS_SETTING_RESET: `/admin/global-loyalty/referrals/reset`,
  ADMIN_GLOBAL_REFERRALS_SETTING_BY_ID: (id: string) => `/admin/global-loyalty/referrals/${id}`,

  ADMIN_LOCAL_REFERRALS_SETTING: `/admin/loyalty/referral`,
  ADMIN_LOCAL_REFERRALS_SETTING_RESET: `/admin/loyalty/referral/reset`,
  ADMIN_LOCAL_REFERRALS_SETTING_BY_ID: (id: string) => `/admin/loyalty/referral/${id}`,

  ADMIN_REFERRALS: (isGlobal: boolean) => (isGlobal ? '/admin/global-loyalty/referrals/user' : '/admin/loyalty/referral/user'),
  ADMIN_REFERRALS_SETTING: (isGlobal: boolean) => (isGlobal ? '/admin/global-loyalty/referrals' : '/admin/loyalty/referrals'),

  ADMIN_LOYALTY_MEMBERS: `/admin/loyalty/club-members`,
  ADMIN_LOYALTY_MEMBERS_GIFT: `/admin/loyalty/club-members/gift-points`,

  // ADMIN_LOYALTY_PROMOTION: `/admin/loyalty/promotions`,
  // ADMIN_LOYALTY_PROMOTION_BY_ID: (id: string) => `/admin/loyalty/promotions/${id}`,

  ADMIN_LOYALTY_PROMOTION: (isGlobal: boolean) => (isGlobal ? '/admin/global-loyalty/promotions' : '/admin/loyalty/promotions'),
  ADMIN_LOYALTY_PROMOTION_BY_ID: (id: string, isGlobal: boolean) =>
    isGlobal ? `/admin/global-loyalty/promotions/${id}` : `/admin/loyalty/promotions/${id}`,

  // ADMIN_LOYALTY_CHALLENGE: `/admin/loyalty/challenges`,
  // ADMIN_LOYALTY_CHALLENGE_BY_ID: (id: string) => `/admin/loyalty/challenges/${id}`,

  ADMIN_LOYALTY_CHALLENGE: (isGlobal: boolean) => (isGlobal ? '/admin/global-loyalty/challanges' : '/admin/loyalty/challenges'),
  ADMIN_LOYALTY_CHALLENGE_BY_ID: (id: string, isGlobal: boolean) =>
    isGlobal ? `/admin/global-loyalty/challanges/${id}` : `/admin/loyalty/challenges/${id}`,

  ADMIN_PRESET: `/admin/menu/presets`,
  ADMIN_PRESET_BY_ID: (id: string) => `/admin/menu/presets/${id}`,

  ADMIN_MENU_CATEGORIES: `/admin/menu/categories`,
  ADMIN_MENU_CATEGORIES_BY_ID: (id: string) => `/admin/menu/categories/${id}`,

  ADMIN_THIRD_PARTY: `/admin/third-party`,
  ADMIN_THIRD_PARTY_BY_ID: (id: string) => `/admin/third-party/${id}`,

  ADMIN_RESERVATION: `/admin/reservations`,
  ADMIN_USERS_RESERVATION: `/admin/reservations/users`,
  ADMIN_RESERVATION_BY_ID: (id: string) => `/admin/reservations/${id}`,
  ADMIN_UPDATE_RESERVATION_STATUS: (id: string, status: string) => `/admin/reservations/updateStatus/${id}/${status}`,
  ADMIN_UPDATE_USER_RESERVATION: (userId: string, id: string) => `/admin/reservations/${userId}/${id}`,

  ADMIN_LOYALTY_TRANSACTIONS: `/admin/transactions`,
  // ADMIN_LOYALTY_TRANSACTIONS: (isGlobal: boolean) => (isGlobal ? '/admin/global-loyalty/transactions' : '/admin/transactions'),

  ORGANIZER_PROMO_CODES: `/organizer/promo-codes`,
  ORGANIZER_PROMO_CODES_BY_ID: (id: string) => `/organizer/promo-codes/${id}`,

  ADMIN_PROMO_CODES: `/admin/promo-codes`,
  ADMIN_PROMO_CODES_BY_ID: (id: string) => `/admin/promo-codes/${id}`,

  ADMIN_MENU: `/admin/menu`,
  ADMIN_MENU_BY_ID: (id: string) => `/admin/menu/${id}`,
  ADMIN_MENU_DUPLICATE_BY_ID: (id: string) => `/admin/menu/duplicate/${id}`,
  ADMIN_MENU_BY_COMPANY_ORGANIZER: (id: string) => `/admin/menu/names/by-company-organizer/${id}`,

  ORGANIZER_MENU: `/organizer/menu`,
  ORGANIZER_MENU_BY_ID: (id: string) => `/organizer/menu/${id}`,
  ORGANIZER_MENU_DUPLICATE_BY_ID: (id: string) => `/organizer/menu/duplicate/${id}`,
  ORGANIZER_MENU_BY_COMPANY_ORGANIZER: (id: string) => `/organizer/menu/names/by-company-organizer/${id}`,

  ADMIN_MENU_ITEMS: `/admin/menu/items`,
  ADMIN_MENU_ITEMS_MINIFY_DATA: `/admin/menu/items/bundles`,
  ADMIN_MENU_ITEMS_BY_ID: (id: string) => `/admin/menu/items/${id}`,
  ADMIN_MENU_ITEMS_BY_MENU_ID: (id: string) => `/admin/menu/items/menu/${id}`,

  TIERS: `/admin/tiers`,
  TIERS_BY_ID: (id: string) => `/admin/tiers/${id}`,

  POPULAR_EVENTS: `/admin/popular-events`,
  POPULAR_EVENTS_REORDER: `/admin/popular-events/reorder`,
  POPULAR_EVENTS_BY_ID: (id: string) => `/admin/popular-events/${id}`,

  TOP_PICKS: `/admin/top-picks`,
  TOP_PICKS_REORDER: `/admin/top-picks/reorder`,
  TOP_PICKS_BY_ID: (id: string) => `/admin/top-picks/${id}`,

  PROMO_SECTION: `/admin/top-promos`,
  PROMO_SECTION_REORDER: `/admin/top-promos/reorder`,
  PROMO_SECTION_BY_ID: (id: string) => `/admin/top-promos/${id}`,

  CUSTOM_CATEGORIES: `/admin/custom-categories`,
  CUSTOM_CATEGORIES_BY_ID: (id: string) => `/admin/custom-categories/${id}`,

  PINNED_CONTENT: `/admin/pinned-content`,
  PINNED_CONTENT_BY_ID: (id: string) => `/admin/pinned-content/${id}`,

  QUICK_ACCESS: `/admin/categories`,
  QUICK_ACCESS_REORDER: `/admin/categories/reorder`,

  BANNER_CONTROL: `/admin/banners`,
  BANNER_CONTROL_BY_ID: (id: string) => `/admin/banners/${id}`,

  SUPPLIERS: `/admin/suppliers`,
  SUPPLIERS_BY_ID: (id: string) => `/admin/suppliers/${id}`,

  TICKETING: `/admin/ticketing`,
  TICKETING_BY_ID: (id: string) => `/admin/ticketing/${id}`,
  TICKETING_BY_ORGANIZATION: (id: string) => `/admin/ticketing/organization/${id}`,
  TICKETING_BY_EVENT: (id: string) => `/admin/events/${id}/ticketings`,

  TAGS: `/admin/tags`,
  TAGS_BY_ID: (id: string) => `/admin/tags/${id}`,

  ADMIN_BADGE_CATEGORIES: `/admin/badge-categories`,
  ADMIN_BADGE_CATEGORIES_BY_ID: (id: string) => `/admin/badge-categories/${id}`,

  STATUS_BADGE: `/admin/status-badges`,
  STATUS_BADGE_REORDER: `/admin/status-badges/reorder`,
  STATUS_BADGE_BY_ID: (id: string) => `/admin/status-badges/${id}`,

  USER_ACCESS: `/admin/features`,
  USER_ACCESS_BY_ID: (id: string) => `/admin/features/${id}`,

  STREAKS: `/admin/loyalty/streaks`,
  STREAKS_BY_ID: (id: string) => `/admin/loyalty/streaks/${id}`,

  // USER_STREAKS: `/admin/loyalty/users-streaks`,
  ADMIN_USER_STREAKS: (isGlobal: boolean) => (isGlobal ? '/admin/global-loyalty/users-streaks' : '/admin/loyalty/users-streaks'),

  ADMIN_USER_LIST: `/admin/users`,
  ADMIN_USER_LIST_BY_ID: (id: string) => `/admin/users/${id}`,
  ADMIN_PENDING_USER_LIST_BY_ID: (id: string) => `/admin/users/${id}`,
};

export default API_ROUTES;

// export const API_ROUTES = {
//   // ── Authentication (no /admin) ───────────────────────────────────────────
//   CHECK_EMAIL_EXISTS: `/auth/check-email-exists`,

//   // Authentication
//   REGISTER: `/auth/register`,
//   SOCIAL_AUTH: `/auth/social-auth`,
//   LOGIN: `/auth/login`,
//   RESEND_OTP: `/auth/link/send-password-reset`,
//   VERIFY_OTP: `/auth/verify-otp/email`,
//   RESET_PASSWORD: `/auth/link/reset-password`,
//   RESUME_ACCOUNT: `/auth/resume-account`,
//   TERMSANDCONDITION: `/settings/terms-conditions`,
//   TERMSANDCONDITION_BY_ID: (id: string) => `/settings/update/${id}`,

//   VENUES_TYPES: `/admin/venue-types`,
//   VENUES_TYPE_By_ID: (id: string) => `/admin/venue-types/${id}`,

//   SUPPLIERS_GLOABAL: `/suppliers/global`,
//   SUPPLIERS: `/admin/suppliers`,
//   SUPPLIERS_BY_ID: (id: string) => `/admin/suppliers/${id}`,

//   CATEGORIES: `/admin/categories`,
//   CATEGORIES_BY_ID: (id: string) => `/admin/categories/${id}`,

//   TAGS: `/admin/tags`,
//   TAGS_BY_ID: (id: string) => `/admin/tags/${id}`,

//   VENUES: `/venues`,
//   VENUES_BY_ID: (id: string) => `/venues/${id}`,

//   ADMIN_VENUES: `/admin/venues`,
//   ADMIN_VENUES_BY_ID: (id: string) => `/admin/venues/${id}`,

//   USER_ACCESS: `/admin/features`,
//   USER_ACCESS_BY_ID: (id: string) => `/admin/features/${id}`,

//   ORGANIZATION: `/organizations`,
//   ORGANIZATION_BY_ID: (id: string) => `/organizations/${id}`,

//   ADMIN_ORGANIZATION: `/admin/organizations`,
//   ADMIN_ORGANIZATION_BY_ID: (id: string) => `/admin/organizations/${id}`,

//   USER_LIST: `/users`,
//   CHANGE_PASSWORD: `/auth/change-password`,
//   USER_LIST_BY_ID: (id: string) => `/users/${id}`,
//   LOYALTY_LISTINGS: `/admin/loyalty/listings`,
//   PENDING_USER_LIST_BY_ID: (id: string) => `/users/${id}`,

//   ADMIN_USER_LIST: `/admin/users`,
//   ADMIN_USER_LIST_BY_ID: (id: string) => `/admin/users/${id}`,
//   ADMIN_PENDING_USER_LIST_BY_ID: (id: string) => `/admin/users/${id}`,

//   HIGHLIGHT_LIST: `/highlights`,
//   HIGHLIGHT_LIST_BY_ID: (id: string) => `/highlights/${id}`,

//   ADMIN_HIGHLIGHT_LIST: `/admin/highlights`,
//   ADMIN_HIGHLIGHT_LIST_BY_ID: (id: string) => `/admin/highlights/${id}`,

//   EVENTS: `/events`,
//   EVENTS_BY_ID: (id: string) => `/events/${id}`,

//   ADMIN_EVENTS: `/admin/events`,
//   ADMIN_EVENTS_BY_ID: (id: string) => `/admin/events/${id}`,

//   PRESET: `/menu/presets`,
//   PRESET_BY_ID: (id: string) => `/menu/presets/${id}`,

//   ADMIN_PRESET: `/admin/menu/presets`,
//   ADMIN_PRESET_BY_ID: (id: string) => `/admin/menu/presets/${id}`,

//   MENU_CATEGORIES: `/menu/categories`,
//   MENU_CATEGORIES_BY_ID: (id: string) => `/menu/categories/${id}`,

//   ADMIN_MENU_CATEGORIES: `/admin/menu/categories`,
//   ADMIN_MENU_CATEGORIES_BY_ID: (id: string) => `/admin/menu/categories/${id}`,

//   MENU: `/menu`,
//   MENU_BY_ID: (id: string) => `/menu/${id}`,
//   MENU_DUPLICATE_BY_ID: (id: string) => `/menu/duplicate/${id}`,

//   ADMIN_MENU: `/admin/menu`,
//   ADMIN_MENU_BY_ID: (id: string) => `/admin/menu/${id}`,
//   ADMIN_MENU_DUPLICATE_BY_ID: (id: string) => `/admin/menu/duplicate/${id}`,

//   MENU_ITEMS: `/menu/items`,
//   MENU_ITEMS_BY_ID: (id: string) => `/menu/items/${id}`,

//   ADMIN_MENU_ITEMS: `/admin/menu/items`,
//   ADMIN_MENU_ITEMS_BY_ID: (id: string) => `/admin/menu/items/${id}`,

//   LOYALTY_REWARDS: `/loyalty/rewards`,
//   LOYALTY_REWARDS_BY_ID: (id: string) => `/loyalty/rewards/${id}`,

//   ADMIN_LOYALTY_REWARDS: `/admin/loyalty/rewards`,
//   ADMIN_LOYALTY_REWARDS_BY_ID: (id: string) => `/admin/loyalty/rewards/${id}`,

//   LOYALTY_PROMOTION: `/loyalty/promotions`,
//   LOYALTY_PROMOTION_BY_ID: (id: string) => `/loyalty/promotions/${id}`,

//   ADMIN_LOYALTY_PROMOTION: `/admin/loyalty/promotions`,
//   ADMIN_LOYALTY_PROMOTION_BY_ID: (id: string) => `/admin/loyalty/promotions/${id}`,

//   LOYALTY_CHALLENGE: `/loyalty/challenges`,
//   LOYALTY_CHALLENGE_BY_ID: (id: string) => `/loyalty/challenges/${id}`,

//   ADMIN_LOYALTY_CHALLENGE: `/admin/loyalty/challenges`,
//   ADMIN_LOYALTY_CHALLENGE_BY_ID: (id: string) => `/admin/loyalty/challenges/${id}`,

//   TIERS: `/admin/tiers`,
//   TIERS_BY_ID: (id: string) => `/admin/tiers/${id}`,

//   PROMO_SECTION: `/admin/top-promos`,
//   PROMO_SECTION_REORDER: `/admin/top-promos/reorder`,
//   PROMO_SECTION_BY_ID: (id: string) => `/admin/top-promos/${id}`,

//   CUSTOM_CATEGORIES: `/admin/custom-categories`,
//   CUSTOM_CATEGORIES_BY_ID: (id: string) => `/admin/custom-categories/${id}`,

//   PINNED_CONTENT: `/admin/pinned-content`,
//   PINNED_CONTENT_BY_ID: (id: string) => `/admin/pinned-content/${id}`,

//   QUICK_ACCESS: `/admin/categories`,
//   QUICK_ACCESS_REORDER: `/admin/categories/reorder`,

//   BANNER_CONTROL: `/admin/banners`,
//   BANNER_CONTROL_BY_ID: (id: string) => `/admin/banners/${id}`,

//   TWO_FACTOR_AUTH_SETUP: `/users/twofa/setup`,
//   TWO_FACTOR_AUTH_CONFIRM: `/users/twofa/confirm`,
//   TWO_FACTOR_AUTH_DISABLE: `/users/twofa/disable`,
// };

// export default API_ROUTES;
