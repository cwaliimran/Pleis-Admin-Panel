import QRCode from 'qrcode';

// ============================================================
// QR label sheets — print-ready A4 PDF (Requirement Set #60)
//
// • Presets for standard self-adhesive label grids; sheet margins are set so
//   the labels line up with the pre-cut sheet.
// • Each label carries the code plus its human-readable text (venue name and
//   e.g. the table number), so a mis-stuck label can be identified without
//   scanning.
// • The QR code is drawn as vector squares, so it stays sharp and scannable at
//   any label size. The text is rendered to a 600 dpi greyscale image, so every
//   character prints (č, ć, đ, š, ž …) without embedding a font.
// ============================================================

export interface LabelSheetPreset {
  id: string;
  label: string;
  columns: number;
  rows: number;
  /** Label size, mm. */
  labelWidth: number;
  labelHeight: number;
  /** Sheet margins, mm (A4 210 × 297). */
  marginTop: number;
  marginLeft: number;
  /** Space between labels, mm. */
  gapX: number;
  gapY: number;
}

export const LABEL_SHEET_PRESETS: LabelSheetPreset[] = [
  {
    id: 'a4-24-70x37',
    label: '24 per sheet · 70 × 37 mm',
    columns: 3,
    rows: 8,
    labelWidth: 70,
    labelHeight: 37,
    marginTop: 0.5,
    marginLeft: 0,
    gapX: 0,
    gapY: 0,
  },
  {
    id: 'a4-21-70x42.3',
    label: '21 per sheet · 70 × 42.3 mm',
    columns: 3,
    rows: 7,
    labelWidth: 70,
    labelHeight: 42.3,
    marginTop: 0.45,
    marginLeft: 0,
    gapX: 0,
    gapY: 0,
  },
];

export interface QRLabel {
  /** Text encoded in the QR code. */
  value: string;
  /** First line, bold — e.g. the venue name. */
  title: string;
  /** Second line — e.g. "Table 5". */
  subtitle?: string;
  /** Module colour; defaults to black. */
  color?: string;
  /** Background colour; defaults to white. */
  bgColor?: string;
}

export interface LabelSheetOptions {
  preset: LabelSheetPreset;
  labels: QRLabel[];
  /** Thin outline around every label, for a test print on plain paper. */
  showOutlines?: boolean;
  /** Labels to leave empty at the start of the first sheet (a partly used sheet). */
  skipLabels?: number;
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PT_PER_MM = 72 / 25.4;
const LABEL_PADDING_MM = 2.5;
const QR_TEXT_GAP_MM = 2;
const QR_QUIET_ZONE_MODULES = 2;
const TEXT_DPI = 600;

const mm = (value: number) => value * PT_PER_MM;
const num = (value: number) => (Math.round(value * 1000) / 1000).toString();

export const labelsPerSheet = (preset: LabelSheetPreset) => preset.columns * preset.rows;

export const sheetCount = (preset: LabelSheetPreset, labelCount: number, skipLabels = 0) =>
  Math.max(1, Math.ceil((labelCount + Math.max(0, skipLabels)) / labelsPerSheet(preset)));

// ---------- colours ----------

const hexToRgb = (hex: string | undefined, fallback: [number, number, number]): [number, number, number] => {
  const match = (hex || '').trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return fallback;
  const value = match[1].length === 3 ? match[1].replace(/./g, (c) => c + c) : match[1];
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255) as [number, number, number];
};

const rgbOp = ([r, g, b]: [number, number, number], op: 'rg' | 'RG') => `${num(r)} ${num(g)} ${num(b)} ${op}`;

// ---------- PDF object assembly ----------

const encoder = new TextEncoder();

interface PdfObject {
  dict: string;
  stream?: Uint8Array;
}

const deflate = async (data: Uint8Array): Promise<Uint8Array> => {
  // "deflate" is the zlib format, which is what PDF's FlateDecode expects.
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new CompressionStream('deflate'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

const buildPdf = (objects: PdfObject[], rootId: number): Uint8Array => {
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: Uint8Array | string) => {
    const bytes = typeof chunk === 'string' ? encoder.encode(chunk) : chunk;
    chunks.push(bytes);
    length += bytes.length;
  };

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  objects.forEach((object, index) => {
    offsets.push(length);
    push(`${index + 1} 0 obj\n`);
    if (object.stream) {
      push(`${object.dict.replace(/>>\s*$/, '')} /Length ${object.stream.length} >>\nstream\n`);
      push(object.stream);
      push('\nendstream\nendobj\n');
    } else {
      push(`${object.dict}\nendobj\n`);
    }
  });

  const xrefOffset = length;
  push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  offsets.forEach((offset) => push(`${String(offset).padStart(10, '0')} 00000 n \n`));
  push(`trailer\n<< /Size ${objects.length + 1} /Root ${rootId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let position = 0;
  chunks.forEach((chunk) => {
    out.set(chunk, position);
    position += chunk.length;
  });
  return out;
};

// ---------- QR code as a vector form ----------

/** Dark modules merged into horizontal runs, in module units, origin bottom-left. */
const qrPath = (value: string): { size: number; path: string } => {
  const qr = QRCode.create(value, { errorCorrectionLevel: 'M' });
  const count = qr.modules.size;
  const size = count + QR_QUIET_ZONE_MODULES * 2;
  const parts: string[] = [];

  for (let row = 0; row < count; row += 1) {
    let col = 0;
    while (col < count) {
      if (!qr.modules.get(row, col)) {
        col += 1;
        continue;
      }
      const start = col;
      while (col < count && qr.modules.get(row, col)) col += 1;
      const x = start + QR_QUIET_ZONE_MODULES;
      const y = size - (row + QR_QUIET_ZONE_MODULES) - 1;
      parts.push(`${x} ${y} ${col - start} 1 re`);
    }
  }

  return { size, path: parts.join('\n') };
};

// ---------- label text as an image ----------

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  const fit = (value: string) => {
    if (ctx.measureText(value).width <= maxWidth) return value;
    let cut = value;
    while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) cut = cut.slice(0, -1);
    return `${cut}…`;
  };

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);

  const used = lines.join(' ').split(/\s+/).length;
  if (used < words.length && lines.length) {
    lines[lines.length - 1] = fit(`${lines[lines.length - 1]}…`);
  }
  return lines.map(fit);
};

const FONT_STACK = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const renderTextImage = async (label: QRLabel, widthMm: number, heightMm: number) => {
  const pxPerMm = TEXT_DPI / 25.4;
  const width = Math.max(1, Math.round(widthMm * pxPerMm));
  const height = Math.max(1, Math.round(heightMm * pxPerMm));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000000';
  ctx.textBaseline = 'top';

  const titleSize = Math.round((10 / 72) * TEXT_DPI); // 10 pt
  const subtitleSize = Math.round((9 / 72) * TEXT_DPI); // 9 pt
  const lineGap = 1.2;

  ctx.font = `700 ${titleSize}px ${FONT_STACK}`;
  const titleLines = wrapText(ctx, label.title || '', width, 3);
  ctx.font = `400 ${subtitleSize}px ${FONT_STACK}`;
  const subtitleLines = label.subtitle ? wrapText(ctx, label.subtitle, width, 2) : [];

  const blockHeight =
    titleLines.length * titleSize * lineGap + (subtitleLines.length ? subtitleSize * 0.4 + subtitleLines.length * subtitleSize * lineGap : 0);
  let y = Math.max(0, (height - blockHeight) / 2);

  ctx.font = `700 ${titleSize}px ${FONT_STACK}`;
  titleLines.forEach((line) => {
    ctx.fillText(line, 0, y);
    y += titleSize * lineGap;
  });
  if (subtitleLines.length) {
    y += subtitleSize * 0.4;
    ctx.font = `400 ${subtitleSize}px ${FONT_STACK}`;
    subtitleLines.forEach((line) => {
      ctx.fillText(line, 0, y);
      y += subtitleSize * lineGap;
    });
  }

  const { data } = ctx.getImageData(0, 0, width, height);
  const grey = new Uint8Array(width * height);
  for (let i = 0, p = 0; i < grey.length; i += 1, p += 4) {
    grey[i] = Math.round(0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]);
  }

  return { width, height, data: await deflate(grey) };
};

// ---------- public API ----------

/** Builds the label sheet PDF. Runs in the browser (canvas + CompressionStream). */
export const createQRLabelSheetPdf = async ({ preset, labels, showOutlines = false, skipLabels = 0 }: LabelSheetOptions): Promise<Blob> => {
  if (!labels.length) throw new Error('No labels to print');

  const perSheet = labelsPerSheet(preset);
  const skip = Math.max(0, Math.min(skipLabels, perSheet - 1));
  const qrSideMm = preset.labelHeight - LABEL_PADDING_MM * 2;
  const textWidthMm = preset.labelWidth - LABEL_PADDING_MM * 2 - qrSideMm - QR_TEXT_GAP_MM;
  const textHeightMm = qrSideMm;

  // Object ids: 1 catalog, 2 pages; the rest are appended in order.
  const objects: PdfObject[] = [{ dict: '<< /Type /Catalog /Pages 2 0 R >>' }, { dict: '' }];
  const add = (object: PdfObject) => {
    objects.push(object);
    return objects.length;
  };

  // One vector form per distinct code, one text image per distinct text.
  const qrForms = new Map<string, number>();
  const textImages = new Map<string, number>();

  for (const label of labels) {
    const dark = hexToRgb(label.color, [0, 0, 0]);
    const light = hexToRgb(label.bgColor, [1, 1, 1]);
    const qrKey = `${label.value}|${dark.join(',')}|${light.join(',')}`;
    if (!qrForms.has(qrKey)) {
      const { size, path } = qrPath(label.value);
      const content = `${rgbOp(light, 'rg')}\n0 0 ${size} ${size} re f\n${rgbOp(dark, 'rg')}\n${path}\nf\n`;
      const stream = await deflate(encoder.encode(content));
      qrForms.set(
        qrKey,
        add({ dict: `<< /Type /XObject /Subtype /Form /BBox [0 0 ${size} ${size}] /Matrix [${num(1 / size)} 0 0 ${num(1 / size)} 0 0] /Filter /FlateDecode >>`, stream })
      );
    }

    const textKey = `${label.title}\u0000${label.subtitle || ''}`;
    if (!textImages.has(textKey) && (label.title || label.subtitle)) {
      const image = await renderTextImage(label, textWidthMm, textHeightMm);
      textImages.set(
        textKey,
        add({
          dict: `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode >>`,
          stream: image.data,
        })
      );
    }
  }

  const xobjectRefs = [
    ...Array.from(qrForms.values()).map((id) => `/Q${id} ${id} 0 R`),
    ...Array.from(textImages.values()).map((id) => `/T${id} ${id} 0 R`),
  ].join(' ');

  const slots: (QRLabel | null)[] = [...Array<null>(skip).fill(null), ...labels];
  const pageIds: number[] = [];

  for (let start = 0; start < slots.length; start += perSheet) {
    const ops: string[] = [];

    slots.slice(start, start + perSheet).forEach((label, index) => {
      const col = index % preset.columns;
      const row = Math.floor(index / preset.columns);
      const x = preset.marginLeft + col * (preset.labelWidth + preset.gapX);
      const yTop = preset.marginTop + row * (preset.labelHeight + preset.gapY);
      const y = A4_HEIGHT_MM - yTop - preset.labelHeight; // PDF origin is bottom-left

      if (showOutlines) {
        ops.push(`q 0.6 0.6 0.6 RG 0.25 w ${num(mm(x))} ${num(mm(y))} ${num(mm(preset.labelWidth))} ${num(mm(preset.labelHeight))} re S Q`);
      }
      if (!label) return;

      const dark = hexToRgb(label.color, [0, 0, 0]);
      const light = hexToRgb(label.bgColor, [1, 1, 1]);
      const qrId = qrForms.get(`${label.value}|${dark.join(',')}|${light.join(',')}`);
      const qrX = x + LABEL_PADDING_MM;
      const qrY = y + LABEL_PADDING_MM;
      ops.push(`q ${num(mm(qrSideMm))} 0 0 ${num(mm(qrSideMm))} ${num(mm(qrX))} ${num(mm(qrY))} cm /Q${qrId} Do Q`);

      const textId = textImages.get(`${label.title}\u0000${label.subtitle || ''}`);
      if (textId) {
        const textX = qrX + qrSideMm + QR_TEXT_GAP_MM;
        ops.push(`q ${num(mm(textWidthMm))} 0 0 ${num(mm(textHeightMm))} ${num(mm(textX))} ${num(mm(qrY))} cm /T${textId} Do Q`);
      }
    });

    const content = await deflate(encoder.encode(ops.join('\n')));
    const contentId = add({ dict: '<< /Filter /FlateDecode >>', stream: content });
    pageIds.push(
      add({
        dict: `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(mm(A4_WIDTH_MM))} ${num(mm(A4_HEIGHT_MM))}] /Resources << /XObject << ${xobjectRefs} >> >> /Contents ${contentId} 0 R >>`,
      })
    );
  }

  objects[1] = { dict: `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>` };

  return new Blob([buildPdf(objects, 1) as BlobPart], { type: 'application/pdf' });
};
