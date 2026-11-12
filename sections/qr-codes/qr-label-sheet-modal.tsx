'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { showError, showSuccess } from '@/utils/toast';
import { createQRLabelSheetPdf, LABEL_SHEET_PRESETS, labelsPerSheet, QRLabel, sheetCount } from '@/utils/qr-label-sheet-pdf';
import { Loader2, Printer } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

// ============================================================
// Print QR labels (Requirement Set #60)
//
// Two layouts: one code repeated across the whole sheet, or a set of
// different codes in sequence (the normal case for tables). Output is a
// print-ready A4 PDF laid out for standard self-adhesive label sheets.
// ============================================================

type LayoutMode = 'same' | 'sequence';

const TYPE_LABELS: Record<string, string> = {
  organization: 'Organization',
  event: 'Event',
  loyalty: 'Loyalty club',
  checkInOrder: 'Check-in / ordering',
  checkInTableID: 'Table',
};

/** Human-readable text printed next to the code: venue name, then e.g. the table number. */
export const toPrintLabel = (qrCode: any): QRLabel => {
  const place = qrCode?.organizationName || qrCode?.venueTitle || qrCode?.eventName || qrCode?.loyaltyClub || '';
  const label = String(qrCode?.label || '').trim();
  const tableName = String(qrCode?.tableLabel || (qrCode?.tableNo != null ? `Table ${qrCode.tableNo}` : '')).trim();
  const tableText = qrCode?.globalQrType === 'checkInTableID' ? tableName : '';

  const title = place || label || tableText || TYPE_LABELS[qrCode?.globalQrType] || 'QR code';
  const subtitleParts = [label && label !== title ? label : '', tableText && !label.toLowerCase().includes(tableText.toLowerCase()) ? tableText : '']
    .filter(Boolean)
    .join(' · ');

  return {
    // The deep link the code carries (#59), not the image URL.
    value: qrCode?.link || '',
    title,
    subtitle: subtitleParts || TYPE_LABELS[qrCode?.globalQrType] || undefined,
    color: qrCode?.color,
    bgColor: qrCode?.bgColor,
  };
};

const sortForSequence = (a: any, b: any) => {
  const tableNumber = (code: any) => {
    if (code?.globalQrType !== 'checkInTableID') return Number.POSITIVE_INFINITY;
    const match = String(code?.tableLabel ?? code?.tableNo ?? '').match(/\d+/);
    return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
  };
  const tableA = tableNumber(a);
  const tableB = tableNumber(b);
  if (tableA !== tableB) return tableA - tableB;
  return String(a?.label || '').localeCompare(String(b?.label || ''), undefined, { numeric: true });
};

interface QRLabelSheetModalProps {
  open: boolean;
  onClose: () => void;
  qrCodes: any[];
  /** Opens in "same code" mode with this code selected. */
  initialCodeId?: string | null;
}

export const QRLabelSheetModal: React.FC<QRLabelSheetModalProps> = ({ open, onClose, qrCodes, initialCodeId }) => {
  const [presetId, setPresetId] = useState(LABEL_SHEET_PRESETS[0].id);
  const [mode, setMode] = useState<LayoutMode>('sequence');
  const [singleId, setSingleId] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copies, setCopies] = useState(1);
  const [skipLabels, setSkipLabels] = useState(0);
  const [showOutlines, setShowOutlines] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const preset = LABEL_SHEET_PRESETS.find((item) => item.id === presetId) ?? LABEL_SHEET_PRESETS[0];
  const perSheet = labelsPerSheet(preset);

  const codes = useMemo(() => [...(qrCodes ?? [])].filter((code) => code?._id && code?.link).sort(sortForSequence), [qrCodes]);

  useEffect(() => {
    if (!open) return;
    if (initialCodeId) {
      setMode('same');
      setSingleId(initialCodeId);
    } else {
      setMode('sequence');
      setSingleId(codes[0]?._id ?? '');
    }
    setSelectedIds(codes.filter((code) => code.globalQrType === 'checkInTableID').map((code) => code._id));
    setCopies(1);
    setSkipLabels(0);
  }, [open, initialCodeId, codes]);

  const labels = useMemo<QRLabel[]>(() => {
    if (mode === 'same') {
      const code = codes.find((item) => item._id === singleId);
      if (!code) return [];
      const label = toPrintLabel(code);
      return Array.from({ length: Math.max(1, copies) * perSheet - skipLabels }, () => label);
    }
    const chosen = codes.filter((code) => selectedIds.includes(code._id)).map(toPrintLabel);
    return Array.from({ length: Math.max(1, copies) }, () => chosen).flat();
  }, [mode, codes, singleId, selectedIds, copies, perSheet, skipLabels]);

  const sheets = labels.length ? sheetCount(preset, labels.length, skipLabels) : 0;
  const allSelected = codes.length > 0 && selectedIds.length === codes.length;

  const toggleCode = (id: string, checked: boolean) =>
    setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id)));

  const handleDownload = async () => {
    if (!labels.length) {
      showError(mode === 'same' ? 'Choose a QR code to print.' : 'Select at least one QR code to print.');
      return;
    }
    setIsGenerating(true);
    try {
      const blob = await createQRLabelSheetPdf({ preset, labels, showOutlines, skipLabels });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-labels-${preset.id}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showSuccess(`Label sheet ready · ${labels.length} labels on ${sheets} ${sheets === 1 ? 'sheet' : 'sheets'}`);
    } catch (error) {
      console.error('QR label sheet error:', error);
      showError('Could not create the label sheet.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !isGenerating && onClose()}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print QR labels</DialogTitle>
          <DialogDescription>
            A print-ready A4 PDF for self-adhesive label sheets. Each label prints the code with its venue and table text, so a mis-stuck label
            can be identified without scanning. Print at 100% (actual size).
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="label-sheet-preset">Label sheet</Label>
              <Select value={presetId} onValueChange={setPresetId}>
                <SelectTrigger id="label-sheet-preset" className="h-10 w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LABEL_SHEET_PRESETS.map((item) => (
                    <SelectItem key={item.id} value={item.id} className="cursor-pointer">
                      A4 · {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Layout</Label>
              <RadioGroup value={mode} onValueChange={(value) => setMode(value as LayoutMode)} className="flex h-10 items-center gap-5">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <RadioGroupItem value="sequence" /> Different codes in sequence
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <RadioGroupItem value="same" /> Same code on every label
                </label>
              </RadioGroup>
            </div>
          </div>

          {mode === 'same' ? (
            <div className="grid gap-4 sm:grid-cols-[1fr_140px_140px]">
              <div className="flex flex-col gap-2">
                <Label htmlFor="label-sheet-code">QR code</Label>
                <Select value={singleId} onValueChange={setSingleId}>
                  <SelectTrigger id="label-sheet-code" className="h-10 w-full cursor-pointer">
                    <SelectValue placeholder="Choose a QR code" />
                  </SelectTrigger>
                  <SelectContent>
                    {codes.map((code) => (
                      <SelectItem key={code._id} value={code._id} className="cursor-pointer">
                        {toPrintLabel(code).title} · {toPrintLabel(code).subtitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="label-sheet-copies">Sheets</Label>
                <Input
                  id="label-sheet-copies"
                  type="number"
                  min={1}
                  max={50}
                  value={copies}
                  onChange={(event) => setCopies(Math.min(50, Math.max(1, Number(event.target.value) || 1)))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="label-sheet-skip">Skip used labels</Label>
                <Input
                  id="label-sheet-skip"
                  type="number"
                  min={0}
                  max={perSheet - 1}
                  value={skipLabels}
                  onChange={(event) => setSkipLabels(Math.min(perSheet - 1, Math.max(0, Number(event.target.value) || 0)))}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>QR codes · printed in this order</Label>
                <button
                  type="button"
                  className="cursor-pointer text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  onClick={() => setSelectedIds(allSelected ? [] : codes.map((code) => code._id))}
                >
                  {allSelected ? 'Clear all' : 'Select all'}
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                {codes.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">No QR codes generated yet.</div>
                ) : (
                  codes.map((code) => {
                    const printLabel = toPrintLabel(code);
                    const checked = selectedIds.includes(code._id);
                    return (
                      <label
                        key={code._id}
                        className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-2 text-sm last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                      >
                        <Checkbox checked={checked} onCheckedChange={(value) => toggleCode(code._id, value === true)} />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{printLabel.title}</span>
                        <span className="text-gray-500 dark:text-gray-400">{printLabel.subtitle}</span>
                        <span className="ml-auto text-xs text-gray-400">{TYPE_LABELS[code.globalQrType] || code.globalQrType}</span>
                      </label>
                    );
                  })
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="label-sheet-sets">Copies of each code</Label>
                  <Input
                    id="label-sheet-sets"
                    type="number"
                    min={1}
                    max={20}
                    value={copies}
                    onChange={(event) => setCopies(Math.min(20, Math.max(1, Number(event.target.value) || 1)))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="label-sheet-skip-seq">Skip used labels on the first sheet</Label>
                  <Input
                    id="label-sheet-skip-seq"
                    type="number"
                    min={0}
                    max={perSheet - 1}
                    value={skipLabels}
                    onChange={(event) => setSkipLabels(Math.min(perSheet - 1, Math.max(0, Number(event.target.value) || 0)))}
                  />
                </div>
              </div>
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox checked={showOutlines} onCheckedChange={(value) => setShowOutlines(value === true)} />
            Print label outlines (test print on plain paper to check alignment)
          </label>

          {/* Sheet preview: first sheet, skipped slots greyed */}
          <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 p-4 dark:bg-[#1a1a1a]">
            <div
              className="grid w-40 gap-px border border-gray-300 bg-gray-300 dark:border-gray-600 dark:bg-gray-600"
              style={{ gridTemplateColumns: `repeat(${preset.columns}, 1fr)`, aspectRatio: '210 / 297' }}
            >
              {Array.from({ length: perSheet }, (_, index) => {
                const filled = index >= skipLabels && index - skipLabels < labels.length;
                return <div key={index} className={cn(filled ? 'bg-white dark:bg-gray-200' : 'bg-gray-200 dark:bg-gray-700')} />;
              })}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {labels.length} {labels.length === 1 ? 'label' : 'labels'} · {sheets} {sheets === 1 ? 'sheet' : 'sheets'} · {preset.label}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" className="cursor-pointer" onClick={onClose} disabled={isGenerating}>
            Close
          </Button>
          <Button type="button" className="cursor-pointer gap-2" onClick={handleDownload} disabled={isGenerating || !labels.length}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
