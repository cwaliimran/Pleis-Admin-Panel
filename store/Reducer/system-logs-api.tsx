import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export type SystemLogSource = 'access' | 'app' | 'error' | 'crash' | 'pm2';
export type SystemLogSurface =
  | 'admin'
  | 'app'
  | 'organizer'
  | 'staff'
  | 'webhook'
  | 'shared'
  | 'system'
  | 'other';

export interface SystemLogEntry {
  time?: string;
  surface?: SystemLogSurface | string;
  method?: string;
  path?: string;
  status?: number;
  durationMs?: number;
  level?: string;
  message?: string;
  pid?: number;
  workerId?: string | number;
  raw?: string;
  [key: string]: unknown;
}

export interface SystemLogFile {
  dir: string;
  surface?: string | null;
  name: string;
  path: string;
  sizeBytes: number;
  sizeKb: number;
  mtime: string;
  isLive: boolean;
}

export const systemLogsApi = createApi({
  reducerPath: 'systemLogsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['systemLogs'],

  endpoints: (builder) => ({
    getSystemLogFiles: builder.query({
      query: () => ({
        url: API_ROUTES.ADMIN_SYSTEM_LOGS_FILES,
        method: 'GET',
      }),
      transformResponse: (res: { data?: { files?: SystemLogFile[]; retentionDays?: number } }) => ({
        files: res.data?.files || [],
        retentionDays: res.data?.retentionDays ?? 14,
      }),
      providesTags: ['systemLogs'],
    }),

    getSystemLogs: builder.query({
      query: ({
        type = 'access',
        date,
        limit = 500,
        keyword,
        level,
        file,
        from = 'tail',
        surface,
      }: {
        type?: SystemLogSource;
        date?: string;
        limit?: number;
        keyword?: string;
        level?: string;
        file?: string;
        from?: 'head' | 'tail';
        surface?: SystemLogSurface | string;
      }) => {
        const params: Record<string, string | number> = {
          type,
          limit,
          from,
        };
        if (date) params.date = date;
        if (keyword) params.keyword = keyword;
        if (level) params.level = level;
        if (file) params.file = file;
        if (surface) params.surface = surface;

        return {
          url: API_ROUTES.ADMIN_SYSTEM_LOGS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: {
        data?: { file?: string; type?: string; entries?: SystemLogEntry[] };
        meta?: { total?: number; limit?: number; retentionDays?: number; from?: string; totalLines?: number };
      }) => ({
        file: res.data?.file || '',
        type: res.data?.type || '',
        entries: res.data?.entries || [],
        meta: res.meta || {},
      }),
      providesTags: ['systemLogs'],
    }),
  }),
});

export const { useGetSystemLogFilesQuery, useGetSystemLogsQuery, useLazyGetSystemLogsQuery } = systemLogsApi;
