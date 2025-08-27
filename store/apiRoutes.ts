const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const API_ROUTES = {
  CHECK_EMAIL_EXISTS: `${API_BASE}/auth/check-email-exists`,

  // Authentication
  REGISTER: `${API_BASE}/auth/register`,
  SOCIAL_AUTH: `${API_BASE}/auth/social-auth`,
  LOGIN: `${API_BASE}/auth/login`,
  RESEND_OTP: `${API_BASE}/auth/resend-otp/email`,
  VERIFY_OTP: `${API_BASE}/auth/verify-otp/email`,
  RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
  RESUME_ACCOUNT: `${API_BASE}/auth/resume-account`,

  VENUES_TYPES: `${API_BASE}/admin/venue-types`,
  VENUES_TYPE_By_ID: (id: string) => `${API_BASE}/admin/venue-types/${id}`,

  SUPPLIERS: `${API_BASE}/admin/suppliers`,
  SUPPLIERS_BY_ID: (id: string) => `${API_BASE}/admin/suppliers/${id}`,

  CATEGORIES: `${API_BASE}/admin/categories`,
  CATEGORIES_BY_ID: (id: string) => `${API_BASE}/admin/categories/${id}`,

  TAGS: `${API_BASE}/admin/tags`,
  TAGS_BY_ID: (id: string) => `${API_BASE}/admin/tags/${id}`,

  VENUES: `${API_BASE}/venues`,
  VENUES_BY_ID: (id: string) => `${API_BASE}/venues/${id}`,
};

export default API_ROUTES;
