export const API_ROUTES = {
  CHECK_EMAIL_EXISTS: `/auth/check-email-exists`,

  // Authentication
  REGISTER: `/auth/register`,
  SOCIAL_AUTH: `/auth/social-auth`,
  LOGIN: `/auth/login`,
  RESEND_OTP: `/auth/link/send-password-reset`,
  VERIFY_OTP: `/auth/verify-otp/email`,
  RESET_PASSWORD: `/auth/link/reset-password`,
  RESUME_ACCOUNT: `/auth/resume-account`,
  TERMSANDCONDITION: `/settings/terms-conditions`,
  TERMSANDCONDITION_BY_ID: (id: string) => `/settings/update/${id}`,

  VENUES_TYPES: `/admin/venue-types`,
  VENUES_TYPE_By_ID: (id: string) => `/admin/venue-types/${id}`,

  SUPPLIERS_GLOABAL: `/suppliers/global`,
  SUPPLIERS: `/admin/suppliers`,
  SUPPLIERS_BY_ID: (id: string) => `/admin/suppliers/${id}`,

  CATEGORIES: `/admin/categories`,
  CATEGORIES_BY_ID: (id: string) => `/admin/categories/${id}`,

  TAGS: `/admin/tags`,
  TAGS_BY_ID: (id: string) => `/admin/tags/${id}`,

  VENUES: `/venues`,
  VENUES_BY_ID: (id: string) => `/venues/${id}`,

  USER_ACCESS: `/admin/features`,
  USER_ACCESS_BY_ID: (id: string) => `/admin/features/${id}`,

  ORGANIZATION: `/organizations`,
  ORGANIZATION_BY_ID: (id: string) => `/organizations/${id}`,

  USER_LIST: `/users`,
  CHANGE_PASSWORD: `/auth/change-password`,
  USER_LIST_BY_ID: (id: string) => `/users/${id}`,
  LOYALTY_LISTINGS: `/loyalty/listings`,
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

  LOYALTY_CHALLENGE: `/loyalty/challenges`,
  LOYALTY_CHALLENGE_BY_ID: (id: string) => `/loyalty/challenges/${id}`,

  TIERS: `/admin/tiers`,
  TIERS_BY_ID: (id: string) => `/admin/tiers/${id}`,

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

  TWO_FACTOR_AUTH_SETUP: `/users/twofa/setup`,
  TWO_FACTOR_AUTH_CONFIRM: `/users/twofa/confirm`,
  TWO_FACTOR_AUTH_DISABLE: `/users/twofa/disable`,
};

export default API_ROUTES;
