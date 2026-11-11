// Versioned legal documents + consent log (PLEIS Legal spec, sections 1 + 5).
import { settingsApi } from './settings';

export type LegalDocumentType = 'terms_of_use' | 'privacy_policy' | 'sales_terms' | 'partner_terms';

export interface LegalDocument {
  _id: string;
  type: LegalDocumentType;
  title: string;
  version: number;
  content: string;
  summary: string;
  effectiveDate: string;
  requiresReacceptance: boolean;
  publishedAt: string;
  publishedBy?: { firstName?: string; lastName?: string; email?: string } | null;
  // status endpoint only
  acceptedVersion?: number | null;
  isReacceptance?: boolean;
}

export interface LegalStatus {
  userType: string;
  required: LegalDocumentType[];
  pending: LegalDocument[];
  upToDate: boolean;
}

export interface ConsentLogRow {
  _id: string;
  user: { _id: string; firstName?: string; lastName?: string; email?: string } | null;
  subjectType: 'user' | 'partner';
  documentType: string;
  action: 'accepted' | 'withdrawn';
  documentVersion: string;
  acceptedAt: string;
  context?: Record<string, any>;
  ip?: string | null;
  platform?: string | null;
  device?: { deviceId?: string | null; deviceType?: string | null };
}

interface Envelope<T> {
  message: string;
  data: T;
  meta?: { page: number; limit: number; total?: number; totalPages?: number; [k: string]: any };
}

const legalApi = settingsApi.enhanceEndpoints({ addTagTypes: ['legalDocs', 'legalStatus', 'consentLogs', 'compliance'] }).injectEndpoints({
  endpoints: (builder) => ({
    // ---- super admin ----
    getAdminLegalDocuments: builder.query<Envelope<LegalDocument[]>, void>({
      query: () => ({ url: '/admin/legal-documents', method: 'GET' }),
      providesTags: ['legalDocs'],
    }),
    getLegalDocumentHistory: builder.query<Envelope<LegalDocument[]>, LegalDocumentType>({
      query: (type) => ({ url: `/admin/legal-documents/${type}/history`, method: 'GET' }),
      providesTags: ['legalDocs'],
    }),
    publishLegalDocument: builder.mutation<
      Envelope<LegalDocument>,
      { type: LegalDocumentType; content: string; summary: string; effectiveDate?: string; requiresReacceptance: boolean }
    >({
      query: (body) => ({ url: '/admin/legal-documents', method: 'POST', body }),
      invalidatesTags: ['legalDocs', 'legalStatus', 'organizerTerms', 'customerTerms', 'privacyPolicy'],
    }),
    getConsentLogs: builder.query<Envelope<ConsentLogRow[]>, { page: number; limit: number; documentType?: string; user?: string }>({
      query: ({ page, limit, documentType, user }) => ({
        url: '/admin/legal-documents/consent-logs',
        method: 'GET',
        params: { page, limit, ...(documentType ? { documentType } : {}), ...(user ? { user } : {}) },
      }),
      providesTags: ['consentLogs'],
    }),

    // ---- any signed-in account (partner gate) ----
    getLegalStatus: builder.query<Envelope<LegalStatus>, void>({
      query: () => ({ url: '/legal/status', method: 'GET' }),
      providesTags: ['legalStatus'],
    }),
    acceptLegalDocuments: builder.mutation<Envelope<LegalStatus>, { acceptances: { type: LegalDocumentType; version: number }[] }>({
      query: (body) => ({ url: '/legal/accept', method: 'POST', body }),
      invalidatesTags: ['legalStatus'],
    }),

    // ---- compliance settings (Requirement Set #108: age_notice_mode) ----
    getComplianceSettings: builder.query<Envelope<{ ageNoticeMode: 'notice' | 'confirmation'; orderingScreenTitle: string }>, void>({
      query: () => ({ url: '/settings/compliance', method: 'GET' }),
      providesTags: ['compliance'],
    }),
    updateComplianceSettings: builder.mutation<
      Envelope<{ ageNoticeMode?: string; orderingScreenTitle?: string }>,
      { ageNoticeMode?: 'notice' | 'confirmation'; orderingScreenTitle?: string }
    >({
      query: (body) => ({ url: '/admin/settings/compliance', method: 'PUT', body }),
      invalidatesTags: ['compliance'],
    }),

    // ---- public ----
    getPublicLegalDocuments: builder.query<Envelope<LegalDocument[]>, LegalDocumentType[]>({
      query: (types) => ({ url: '/legal/documents', method: 'GET', params: { types: types.join(',') } }),
    }),
  }),
});

export const {
  useGetAdminLegalDocumentsQuery,
  useGetLegalDocumentHistoryQuery,
  usePublishLegalDocumentMutation,
  useGetConsentLogsQuery,
  useGetLegalStatusQuery,
  useAcceptLegalDocumentsMutation,
  useGetPublicLegalDocumentsQuery,
  useGetComplianceSettingsQuery,
  useUpdateComplianceSettingsMutation,
} = legalApi;
