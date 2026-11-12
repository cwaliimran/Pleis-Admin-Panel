// Menu item CSV / Excel import + export (Requirement Set #122).
// The file is re-sent with each step (parse → validate → commit); the server is stateless.
import API_ROUTES from '../apiRoutes';
import { menuItemsApi } from './menu-items-api';

const routes = (suffix: string) => ({
  adminRoute: `${API_ROUTES.ADMIN_MENU_ITEMS}${suffix}`,
  organizerRoute: `${API_ROUTES.ORGANIZER_MENU_ITEMS}${suffix}`,
});

export type ImportFieldKind = 'text' | 'number' | 'boolean' | 'enum' | 'list' | 'time' | 'ref' | 'refList';

export interface ImportField {
  key: string;
  label: string;
  kind: ImportFieldKind;
  ref?: string;
  required: boolean;
  options?: string[];
  help?: string;
  default?: string | boolean;
}

export interface LookupOption {
  id: string;
  label: string;
}

export interface ImportSheet {
  name: string;
  headerRow: number;
  /** template v2: menus listed in row 1 (B1 →) — every item is placed in all of them */
  fileMenus?: string[];
  rawRows: string[][];
  headers: string[];
  rowCount: number;
  truncated: boolean;
  suggestedMapping: Record<string, string>;
}

export interface ImportRowResult {
  row: number;
  /** menu this result is for (a row is checked once per menu in row 1) */
  menu?: string;
  action: 'create' | 'update' | 'error';
  matchId: string | null;
  title: string;
  errors: string[];
  /** records this row creates, e.g. 'new subcategory “Coffee”' */
  notes?: string[];
}

export interface ImportReport {
  sheet: string;
  headerRow: number;
  headers: string[];
  summary: { rows?: number; total: number; create: number; update: number; error: number };
  fileMenus?: string[];
  results: ImportRowResult[];
  unresolved: Record<string, Record<string, number>>;
  /** names that do not exist yet and are created on import, per record type */
  toCreate?: Record<string, string[]>;
  venues?: LookupOption[];
  defaultVenue?: string | null;
  committed?: boolean;
  written?: { created: number; updated: number; failed: number; records?: Record<string, number> };
}

export interface ImportOptions {
  sheet: string;
  headerRow: number;
  mapping: Record<string, string>;
  defaults: Record<string, string>;
  valueMappings: Record<string, Record<string, string>>;
  stopOnError?: boolean;
  /** venue for menus the import creates */
  organization?: string;
}

/** multipart body: the file + JSON options (+ company for super admin) */
export const buildImportForm = (file: File, options?: Partial<ImportOptions>, companyOrganizer?: string) => {
  const form = new FormData();
  form.append('file', file);
  if (options) form.append('options', JSON.stringify(options));
  if (companyOrganizer) form.append('companyOrganizer', companyOrganizer);
  return form;
};

const importApi = menuItemsApi.injectEndpoints({
  endpoints: (builder) => ({
    getMenuItemImportFields: builder.query<
      { data: { fields: ImportField[]; lookups: Record<string, LookupOption[]>; skipValue: string } },
      { companyOrganizer?: string }
    >({
      query: ({ companyOrganizer }) => ({
        url: '',
        method: 'GET',
        params: companyOrganizer ? { companyOrganizer } : {},
        roleBasedRouting: routes('/import-file/fields'),
      }),
    }),
    parseMenuItemImportFile: builder.mutation<{ data: { fileName: string; format: string; delimiter?: string; sheets: ImportSheet[] } }, FormData>({
      query: (body) => ({ url: '', method: 'POST', body, roleBasedRouting: routes('/import-file/parse') }),
    }),
    validateMenuItemImport: builder.mutation<{ data: ImportReport }, FormData>({
      query: (body) => ({ url: '', method: 'POST', body, roleBasedRouting: routes('/import-file/validate') }),
    }),
    commitMenuItemImport: builder.mutation<{ message: string; data: ImportReport }, FormData>({
      query: (body) => ({ url: '', method: 'POST', body, roleBasedRouting: routes('/import-file/commit') }),
      invalidatesTags: ['menu-item'],
    }),
    downloadMenuItemTemplate: builder.mutation<string, void>({
      query: () => ({ url: '', method: 'GET', responseHandler: 'text', roleBasedRouting: routes('/import-file/template') }),
    }),
    exportMenuItems: builder.mutation<string, { companyOrganizer?: string; menu?: string }>({
      query: ({ companyOrganizer, menu }) => ({
        url: '',
        method: 'GET',
        params: { ...(companyOrganizer ? { companyOrganizer } : {}), ...(menu ? { menu } : {}) },
        responseHandler: 'text',
        roleBasedRouting: routes('/export'),
      }),
    }),
  }),
});

export const {
  useGetMenuItemImportFieldsQuery,
  useParseMenuItemImportFileMutation,
  useValidateMenuItemImportMutation,
  useCommitMenuItemImportMutation,
  useDownloadMenuItemTemplateMutation,
  useExportMenuItemsMutation,
} = importApi;

/** Download a binary file (e.g. the .xlsx template) with the signed-in user's token. */
export const downloadAuthorized = async (path: string, token: string | undefined, filename: string) => {
  const { CurrentUrl } = await import('@/constant/constant');
  const res = await fetch(`${String(CurrentUrl).replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || 'Download failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Save text (CSV) as a file in the browser. */
export const saveTextFile = (text: string, filename: string, type = 'text/csv;charset=utf-8') => {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
