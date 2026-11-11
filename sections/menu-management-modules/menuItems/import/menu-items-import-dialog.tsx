'use client';

/**
 * Menu item import wizard (Requirement Set #122).
 *
 * Organizers send their menus in every shape. This wizard takes any .csv / .xlsx, shows the
 * whole file, lets the admin map the organizer's columns to our fields and the organizer's
 * values (their categories, menus, presets, allergens…) to our records, validates every row
 * and only then imports — inserting new items and updating existing ones.
 */
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Upload } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  buildImportForm,
  downloadAuthorized,
  ImportField,
  ImportOptions,
  ImportReport,
  ImportSheet,
  saveTextFile,
  useCommitMenuItemImportMutation,
  useGetMenuItemImportFieldsQuery,
  useParseMenuItemImportFileMutation,
  useValidateMenuItemImportMutation,
} from '@/store/Reducer/menu-items-import-api';
import API_ROUTES from '@/store/apiRoutes';
import { RootState } from '@/store/store';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';

const NONE = '__none__';
const STEPS = ['Upload', 'Preview', 'Map columns', 'Map values', 'Review', 'Done'] as const;
type Step = 0 | 1 | 2 | 3 | 4 | 5;

const REF_LABELS: Record<string, string> = {
  menu: 'menu',
  subCategory: 'subcategory',
  presetType: 'preset type',
  brand: 'brand',
  serving: 'serving',
  daypart: 'daypart',
  dietTag: 'diet tag',
  allergen: 'allergen',
};

interface Props {
  open: boolean;
  onClose: () => void;
  /** super admin: the selected company; organizer: undefined (server uses the session) */
  companyOrganizer?: string;
}

export default function MenuItemsImportDialog({ open, onClose, companyOrganizer }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<ImportSheet[]>([]);
  const [sheetName, setSheetName] = useState('');
  const [headerRow, setHeaderRow] = useState(0);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [defaults, setDefaults] = useState<Record<string, string>>({});
  const [valueMappings, setValueMappings] = useState<Record<string, Record<string, string>>>({});
  const [report, setReport] = useState<ImportReport | null>(null);
  const [stopOnError, setStopOnError] = useState(false);
  const [onlyErrors, setOnlyErrors] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: fieldsData, isFetching: fieldsLoading } = useGetMenuItemImportFieldsQuery(
    { companyOrganizer },
    { skip: !open, refetchOnMountOrArgChange: true }
  );
  const [parseFile, { isLoading: parsing }] = useParseMenuItemImportFileMutation();
  const [validateImport, { isLoading: validating }] = useValidateMenuItemImportMutation();
  const [commitImport, { isLoading: committing }] = useCommitMenuItemImportMutation();
  const [downloading, setDownloading] = useState(false);
  const [venue, setVenue] = useState('');
  const { user } = useSelector((state: RootState) => state.userSlice);
  const isSuperAdmin = user?.role === 'admin' || user?.role === 'superAdmin';

  const fields: ImportField[] = fieldsData?.data?.fields || [];
  const lookups = fieldsData?.data?.lookups || {};
  const skipValue = fieldsData?.data?.skipValue || '__skip__';

  const sheet = sheets.find((s) => s.name === sheetName) || sheets[0];
  const headers = useMemo(() => {
    if (!sheet) return [] as string[];
    const cells = sheet.rawRows[headerRow] || [];
    const width = Math.max(cells.length, ...sheet.rawRows.slice(headerRow + 1).map((r) => r.length), 0);
    const seen: Record<string, number> = {};
    return Array.from({ length: width }, (_, i) => {
      let h = (cells[i] || '').trim() || `Column ${i + 1}`;
      if (seen[h]) h = `${h} (${(seen[h] += 1)})`;
      else seen[h] = 1;
      return h;
    });
  }, [sheet, headerRow]);
  const dataRows = useMemo(() => (sheet ? sheet.rawRows.slice(headerRow + 1) : []), [sheet, headerRow]);

  const missingRequired = fields.filter((f) => f.required && !mapping[f.key] && !defaults[f.key]);

  const reset = () => {
    setStep(0);
    setFile(null);
    setSheets([]);
    setSheetName('');
    setHeaderRow(0);
    setMapping({});
    setDefaults({});
    setValueMappings({});
    setReport(null);
    setStopOnError(false);
    setOnlyErrors(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const options = (extra: Partial<ImportOptions> = {}): ImportOptions => ({
    sheet: sheet?.name || '',
    headerRow,
    mapping,
    defaults,
    valueMappings,
    ...(venue ? { organization: venue } : {}),
    ...extra,
  });

  /* ---------------- step actions ---------------- */

  // Template in our format with the company's real menu / subcategory names + "Valid values" sheet
  const onTemplate = async (format: 'xlsx' | 'csv') => {
    setDownloading(true);
    try {
      const base = isSuperAdmin ? API_ROUTES.ADMIN_MENU_ITEMS : API_ROUTES.ORGANIZER_MENU_ITEMS;
      const qs = new URLSearchParams({ format, ...(companyOrganizer ? { companyOrganizer } : {}) });
      await downloadAuthorized(`${base}/import-file/template?${qs}`, user?.token, `pleis-menu-items-template.${format}`);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setDownloading(false);
    }
  };

  const onFile = async (f: File | null) => {
    if (!f) return;
    if (!/\.(csv|tsv|txt|xlsx)$/i.test(f.name)) {
      showError('Use a .csv or .xlsx file (old .xls: save it as .xlsx first).');
      return;
    }
    try {
      const res = await parseFile(buildImportForm(f)).unwrap();
      const list = res.data.sheets.filter((s) => s.rowCount > 0);
      if (!list.length) {
        showError('The file has no rows.');
        return;
      }
      setFile(f);
      setSheets(list);
      setSheetName(list[0].name);
      setHeaderRow(list[0].headerRow);
      setMapping(list[0].suggestedMapping || {});
      setStep(1); // preview the data first; "Check rows" validates with the auto-mapping
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const onSheetChange = (name: string) => {
    const s = sheets.find((x) => x.name === name);
    setSheetName(name);
    if (s) {
      setHeaderRow(s.headerRow);
      setMapping(s.suggestedMapping || {});
    }
  };

  const runValidate = async (next?: Step) => {
    if (!file) return;
    try {
      const res = await validateImport(buildImportForm(file, options(), companyOrganizer)).unwrap();
      setReport(res.data);
      const hasUnresolved = Object.keys(res.data.unresolved || {}).length > 0;
      setStep(next ?? (hasUnresolved ? 3 : 4));
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const runCommit = async () => {
    if (!file) return;
    try {
      const res = await commitImport(buildImportForm(file, options({ stopOnError }), companyOrganizer)).unwrap();
      setReport(res.data);
      const w = res.data.written;
      showSuccess(`Import finished: ${w?.created ?? 0} created, ${w?.updated ?? 0} updated.`);
      setStep(5);
    } catch (error: any) {
      // 422 = stopped because rows have errors; the report is in the body
      const data = error?.data?.data as ImportReport | undefined;
      if (data) {
        setReport(data);
        showError('Nothing was imported — fix the rows with errors or choose “Import valid rows only”.');
        setStep(4);
      } else showError(getErrorMessage(error));
    }
  };

  const downloadErrorReport = () => {
    if (!report) return;
    const rows = report.results.filter((r) => r.action === 'error');
    const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const csv = ['row,name,errors', ...rows.map((r) => [String(r.row), r.title, r.errors.join(' | ')].map(esc).join(','))].join('\r\n');
    saveTextFile(`﻿${csv}\r\n`, 'menu-import-errors.csv');
  };

  /* ---------------- render helpers ---------------- */

  const fieldDefaultControl = (f: ImportField) => {
    const value = defaults[f.key] ?? '';
    const set = (v: string) => setDefaults((d) => ({ ...d, [f.key]: v === NONE ? '' : v }));
    if (f.kind === 'ref' && f.ref) {
      return (
        <Select value={value || NONE} onValueChange={set}>
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="—" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>— none —</SelectItem>
            {(lookups[f.ref] || []).map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    if (f.kind === 'boolean' || f.kind === 'enum') {
      const opts = f.kind === 'boolean' ? ['yes', 'no'] : f.options || [];
      return (
        <Select value={value || NONE} onValueChange={set}>
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="—" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>— none —</SelectItem>
            {opts.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    if (f.kind === 'refList' || f.key === 'id') return <span className="text-muted-foreground text-xs">—</span>;
    return <Input className="h-9" value={value} onChange={(e) => set(e.target.value)} placeholder="—" />;
  };

  const sampleFor = (col?: string) => {
    if (!col) return '';
    const idx = headers.indexOf(col);
    const v = dataRows.find((r) => (r[idx] || '').trim())?.[idx];
    return v ? String(v).slice(0, 40) : '';
  };

  const unresolvedEntries = Object.entries(report?.unresolved || {});
  const unmappedLeft = unresolvedEntries.reduce(
    (n, [key, values]) => n + Object.keys(values).filter((v) => !valueMappings[key]?.[v]).length,
    0
  );

  /* ---------------- render ---------------- */

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="dark:bg-secondary flex max-h-[92vh] w-full flex-col gap-4 md:max-w-[1150px]!">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileSpreadsheet className="h-5 w-5" /> Import menu items
          </DialogTitle>
          <DialogDescription>
            Any .csv or .xlsx — map the organizer&apos;s columns and values to Pleis, check every row, then import.
          </DialogDescription>
        </DialogHeader>

        {/* stepper */}
        <ol className="flex flex-wrap gap-2 text-xs">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={`rounded-full border px-3 py-1 ${i === step ? 'border-primary bg-primary text-primary-foreground' : i < step ? 'border-primary/40' : 'opacity-60'}`}
            >
              {i + 1}. {s}
            </li>
          ))}
        </ol>

        <div className="min-h-[300px] overflow-y-auto pr-1">
          {/* 1. UPLOAD */}
          {step === 0 && (
            <div className="space-y-5">
              <div
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center dark:border-gray-700"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onFile(e.dataTransfer.files?.[0] || null);
                }}
              >
                <Upload className="h-8 w-8 opacity-60" />
                <div className="font-medium">{parsing ? 'Reading file…' : 'Drop a file here or click to choose'}</div>
                <div className="text-muted-foreground text-sm">.csv (any delimiter) or .xlsx · up to 10 MB · every sheet is read</div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,.tsv,.txt,.xlsx"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4 dark:border-gray-700">
                <div className="text-sm">
                  <div className="font-medium">Pleis menu item format</div>
                  <div className="text-muted-foreground">
                    Every column we import, example rows with this company&apos;s menus and subcategories, a “Valid values” sheet and instructions.
                    Copy the organizer&apos;s menu into these columns and import it as is. Exports use the same columns.
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onTemplate('xlsx')} disabled={downloading} className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Excel template
                  </Button>
                  <Button variant="ghost" onClick={() => onTemplate('csv')} disabled={downloading}>
                    CSV
                  </Button>
                </div>
              </div>
              <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-xs">
                <li>An item is updated when its “Pleis item ID” matches, otherwise when the same name exists in the same menu; any other row creates a new item.</li>
                <li>Every row needs a name, menu, subcategory, price and tax class (25 / 13 / 5 / 0). 18+ items can never be marked “to go”.</li>
                <li>A menu, subcategory, brand, serving, daypart, diet tag or allergen that does not exist yet is created on import (you see the list before importing). Preset types must already exist.</li>
              </ul>
            </div>
          )}

          {/* 2. PREVIEW */}
          {step === 1 && sheet && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="text-sm">
                  <div className="font-medium">{file?.name}</div>
                  <div className="text-muted-foreground">
                    {dataRows.length} data rows · {headers.length} columns{sheet.truncated ? ' · only the first 10,000 rows are imported' : ''}
                  </div>
                </div>
                {sheets.length > 1 && (
                  <div className="w-56">
                    <Label className="mb-1 block text-xs">Sheet</Label>
                    <Select value={sheet.name} onValueChange={onSheetChange}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sheets.map((s) => (
                          <SelectItem key={s.name} value={s.name}>
                            {s.name} ({s.rowCount})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="w-72">
                  <Label className="mb-1 block text-xs">Header row (column names)</Label>
                  <Select value={String(headerRow)} onValueChange={(v) => setHeaderRow(Number(v))}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sheet.rawRows.slice(0, 15).map((r, i) => (
                        <SelectItem key={i} value={String(i)}>
                          Row {i + 1}: {r.filter(Boolean).slice(0, 3).join(' · ').slice(0, 40) || '(empty)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="max-h-[420px] overflow-auto rounded-md border dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      {headers.map((h) => (
                        <TableHead key={h} className="whitespace-nowrap">
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataRows.slice(0, 50).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-muted-foreground text-xs">{headerRow + 2 + i}</TableCell>
                        {headers.map((h, j) => (
                          <TableCell key={h} className="max-w-[220px] truncate text-sm" title={r[j] || ''}>
                            {r[j] || ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {dataRows.length > 50 && <p className="text-muted-foreground text-xs">Showing the first 50 of {dataRows.length} rows.</p>}
            </div>
          )}

          {/* 3. MAP COLUMNS */}
          {step === 2 && (
            <div className="space-y-4">
              {missingRequired.length > 0 ? (
                <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-700 dark:bg-amber-950/40">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <b>Missing required fields:</b> {missingRequired.map((f) => f.label).join(', ')}. Map a column, or set a value for all rows.
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-md border border-green-300 bg-green-50 p-3 text-sm dark:border-green-800 dark:bg-green-950/40">
                  <CheckCircle2 className="h-4 w-4" /> All required fields are covered.
                </div>
              )}
              <div className="overflow-auto rounded-md border dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pleis field</TableHead>
                      <TableHead className="w-[260px]">Column in the file</TableHead>
                      <TableHead>Sample</TableHead>
                      <TableHead className="w-[230px]">Value for all rows (if empty)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((f) => (
                      <TableRow key={f.key}>
                        <TableCell>
                          <div className="flex items-center gap-2 font-medium">
                            {f.label}
                            {f.required && <Badge variant="destructive">required</Badge>}
                          </div>
                          {f.help && <div className="text-muted-foreground text-xs">{f.help}</div>}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={mapping[f.key] || NONE}
                            onValueChange={(v) => setMapping((m) => {
                              const next = { ...m };
                              if (v === NONE) delete next[f.key];
                              else next[f.key] = v;
                              return next;
                            })}
                          >
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={NONE}>— not mapped —</SelectItem>
                              {headers.map((h) => (
                                <SelectItem key={h} value={h}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate text-xs">{sampleFor(mapping[f.key])}</TableCell>
                        <TableCell>{fieldDefaultControl(f)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {headers.filter((h) => !Object.values(mapping).includes(h)).length > 0 && (
                <p className="text-muted-foreground text-xs">
                  Not imported (no field mapped): {headers.filter((h) => !Object.values(mapping).includes(h)).join(', ')}
                </p>
              )}
            </div>
          )}

          {/* 4. MAP VALUES */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-sm">
                These values from the file do not match anything in Pleis yet. Connect each one to a Pleis record (for example the organizer&apos;s
                category “Pivo” → our subcategory “Drinks”), or skip it.
              </p>
              {unresolvedEntries.length === 0 && <p className="text-sm">All values are matched.</p>}
              {unresolvedEntries.map(([key, values]) => {
                const f = fields.find((x) => x.key === key);
                const ref = f?.ref || key;
                return (
                  <div key={key} className="rounded-md border p-3 dark:border-gray-700">
                    <div className="mb-2 font-semibold">
                      {f?.label || key} <span className="text-muted-foreground text-xs font-normal">→ Pleis {REF_LABELS[ref] || ref}</span>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {Object.entries(values).map(([raw, count]) => (
                        <div key={raw} className="flex items-center gap-2">
                          <div className="w-1/2 truncate text-sm" title={raw}>
                            “{raw}” <span className="text-muted-foreground text-xs">× {count}</span>
                          </div>
                          <Select
                            value={valueMappings[key]?.[raw] || NONE}
                            onValueChange={(v) => setValueMappings((vm) => ({ ...vm, [key]: { ...(vm[key] || {}), [raw]: v === NONE ? '' : v } }))}
                          >
                            <SelectTrigger className="h-9 w-1/2">
                              <SelectValue placeholder="Choose…" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={NONE}>Choose…</SelectItem>
                              <SelectItem value={skipValue}>Skip this value</SelectItem>
                              {(lookups[ref] || []).map((o) => (
                                <SelectItem key={o.id} value={o.id}>
                                  {o.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {unmappedLeft > 0 && <p className="text-muted-foreground text-xs">{unmappedLeft} value(s) still unconnected — rows using them will be reported as errors.</p>}
            </div>
          )}

          {/* 5. REVIEW */}
          {step === 4 && report && (
            <div className="space-y-4">
              {report.toCreate && Object.keys(report.toCreate).length > 0 && (
                <div className="rounded-md border border-blue-300 bg-blue-50 p-3 text-sm dark:border-blue-800 dark:bg-blue-950/40">
                  <div className="mb-1 font-semibold">Will be created on import (do not exist yet):</div>
                  <ul className="list-disc space-y-0.5 pl-5">
                    {Object.entries(report.toCreate).map(([ref, names]) => (
                      <li key={ref}>
                        <b>{REF_LABELS[ref] || ref}</b>: {names.join(', ')}
                      </li>
                    ))}
                  </ul>
                  {report.toCreate.menu && (report.venues?.length || 0) > 1 && (
                    <div className="mt-2 flex items-center gap-2">
                      <span>Venue for the new menu(s):</span>
                      <Select value={venue || report.defaultVenue || ''} onValueChange={setVenue}>
                        <SelectTrigger className="h-8 w-64">
                          <SelectValue placeholder="Choose venue" />
                        </SelectTrigger>
                        <SelectContent>
                          {(report.venues || []).map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="secondary">{report.summary.total} rows</Badge>
                <Badge className="bg-green-600 text-white">{report.summary.create} new</Badge>
                <Badge className="bg-blue-600 text-white">{report.summary.update} update</Badge>
                <Badge variant="destructive">{report.summary.error} with errors</Badge>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <RadioGroup value={stopOnError ? 'stop' : 'valid'} onValueChange={(v) => setStopOnError(v === 'stop')} className="flex flex-wrap gap-4">
                  <Label className="flex cursor-pointer items-center gap-2 font-normal">
                    <RadioGroupItem value="valid" /> Import valid rows only
                  </Label>
                  <Label className="flex cursor-pointer items-center gap-2 font-normal">
                    <RadioGroupItem value="stop" /> Import nothing if any row has an error
                  </Label>
                </RadioGroup>
                <Label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
                  <input type="checkbox" checked={onlyErrors} onChange={(e) => setOnlyErrors(e.target.checked)} /> Show errors only
                </Label>
              </div>
              <div className="max-h-[380px] overflow-auto rounded-md border dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Row</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-24">Result</TableHead>
                      <TableHead>Problems / notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.results
                      .filter((r) => !onlyErrors || r.action === 'error')
                      .map((r) => (
                        <TableRow key={r.row}>
                          <TableCell className="text-muted-foreground text-xs">{r.row}</TableCell>
                          <TableCell className="text-sm">{r.title || '—'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={r.action === 'error' ? 'destructive' : 'secondary'}
                              className={r.action === 'create' ? 'bg-green-600 text-white' : r.action === 'update' ? 'bg-blue-600 text-white' : ''}
                            >
                              {r.action === 'create' ? 'new' : r.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            {r.errors.length > 0 && <span className="text-red-600 dark:text-red-400">{r.errors.join(' · ')}</span>}
                            {r.errors.length === 0 && (r.notes?.length || 0) > 0 && <span className="text-blue-600 dark:text-blue-400">{r.notes?.join(' · ')}</span>}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* 6. DONE */}
          {step === 5 && report && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
              <div className="text-lg font-semibold">Import finished</div>
              <div className="text-sm">
                {report.written?.created ?? 0} items created · {report.written?.updated ?? 0} updated · {report.summary.error} not imported
              </div>
              {report.written?.records && Object.keys(report.written.records).length > 0 && (
                <div className="text-muted-foreground text-sm">
                  Also created: {Object.entries(report.written.records).map(([ref, n]) => `${n} ${REF_LABELS[ref] || ref}${n > 1 ? 's' : ''}`).join(', ')}
                </div>
              )}
              {report.summary.error > 0 && (
                <Button variant="outline" onClick={downloadErrorReport} className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> Download rows with errors
                </Button>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4 dark:border-gray-700">
          <Button variant="ghost" onClick={step === 0 || step === 5 ? close : () => setStep((s) => (s === 4 && unresolvedEntries.length === 0 ? 1 : s - 1) as Step)}>
            {step === 0 || step === 5 ? 'Close' : 'Back'}
          </Button>
          <div className="flex gap-2">
            {step === 1 && (
              <>
                <Button variant="outline" onClick={() => setStep(2)} disabled={fieldsLoading || headers.length === 0}>
                  {missingRequired.length ? 'Map columns' : 'Adjust columns'}
                </Button>
                {missingRequired.length === 0 && (
                  <Button onClick={() => runValidate()} disabled={validating || fieldsLoading}>
                    {validating ? 'Checking…' : 'Check rows'}
                  </Button>
                )}
              </>
            )}
            {step === 2 && (
              <Button onClick={() => runValidate()} disabled={validating || missingRequired.length > 0}>
                {validating ? 'Checking…' : 'Check rows'}
              </Button>
            )}
            {step === 3 && (
              <Button onClick={() => runValidate(4)} disabled={validating}>
                {validating ? 'Checking…' : 'Apply and review'}
              </Button>
            )}
            {step === 4 && report && (
              <>
                {report.summary.error > 0 && (
                  <Button variant="outline" onClick={downloadErrorReport}>
                    Download errors
                  </Button>
                )}
                <Button
                  onClick={runCommit}
                  disabled={committing || report.summary.create + report.summary.update === 0 || (stopOnError && report.summary.error > 0)}
                >
                  {committing ? 'Importing…' : `Import ${report.summary.create + report.summary.update} item(s)`}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
