'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  type SystemLogEntry,
  type SystemLogFile,
  type SystemLogSource,
  useGetSystemLogFilesQuery,
  useGetSystemLogsQuery,
} from '@/store/Reducer/system-logs-api';
import { Pause, Play, RefreshCw, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type SystemLogSocketEvent,
  type SystemLogsSocketStatus,
  useSystemLogsSocket,
} from './use-system-logs-socket';

const MAX_LIVE_ENTRIES = 500;

const SOURCE_COLORS: Record<string, string> = {
  access: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  app: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  error: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  crash: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
  pm2: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
};

const SOURCE_LABELS: Record<string, string> = {
  access: 'HTTP',
  app: 'INFO',
  error: 'ERR/WARN',
  crash: 'CRASH',
  pm2: 'PM2',
};

const STATUS_LABEL: Record<SystemLogsSocketStatus, string> = {
  idle: 'Idle',
  connecting: 'Connecting…',
  connected: 'Live',
  disconnected: 'Disconnected',
  error: 'Error',
};

const SURFACE_OPTIONS = [
  { value: 'all', label: 'All surfaces' },
  { value: 'admin', label: 'Admin API' },
  { value: 'app', label: 'Mobile App API' },
  { value: 'organizer', label: 'Organizer API' },
  { value: 'staff', label: 'Staff API' },
  { value: 'webhook', label: 'Webhooks' },
  { value: 'shared', label: 'Shared (/auth…)' },
] as const;

function formatEntry(entry: SystemLogEntry, source: string): string {
  if (entry.raw) return String(entry.raw);

  if (source === 'access') {
    const surface = entry.surface ? `[${entry.surface}] ` : '';
    return `${surface}${entry.method || 'GET'} ${entry.path || ''} → ${entry.status ?? ''} (${entry.durationMs ?? '?'}ms)`;
  }

  const level = entry.level ? `[${entry.level}] ` : '';
  const msg = entry.message || '';
  const detail =
    entry.error != null
      ? ` — ${typeof entry.error === 'string' ? entry.error : JSON.stringify(entry.error)}`
      : entry.path
        ? ` ${entry.method || ''} ${entry.path}`
        : '';
  return `${level}${msg}${detail}`;
}

function entryKey(source: string, entry: SystemLogEntry, index: number): string {
  return `${source}-${entry.time || ''}-${entry.path || entry.message || ''}-${index}`;
}

function matchesSource(file: SystemLogFile, source?: SystemLogSource, surface?: string): boolean {
  if (!source) return true;
  if (source === 'access') {
    if (file.dir !== 'access') return false;
    if (!surface || surface === 'all') {
      // Combined folder + legacy flat access-*.log
      return (
        file.surface === 'all' ||
        file.path.includes('/all/') ||
        file.name.startsWith('access-')
      );
    }
    return (
      file.surface === surface ||
      file.path.includes(`/access/${surface}/`) ||
      file.name.startsWith(`${surface}-`)
    );
  }
  if (source === 'app') return file.dir === 'app' && file.name.startsWith('app');
  if (source === 'error') return file.dir === 'app' && file.name.startsWith('error');
  if (source === 'crash') return file.dir === 'crash';
  if (source === 'pm2') return file.dir === 'pm2';
  return false;
}

interface SystemLogsViewerProps {
  /** When set, only this source is shown (historical + live). When omitted, live all sources. */
  source?: SystemLogSource;
  title: string;
  description?: string;
  live?: boolean;
  initialLimit?: number;
}

interface DisplayRow {
  id: string;
  source: string;
  entry: SystemLogEntry;
  live?: boolean;
}

export default function SystemLogsViewer({
  source,
  title,
  description,
  live = true,
  initialLimit = 800,
}: SystemLogsViewerProps) {
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState<string>(source === 'error' ? 'ERROR' : 'all');
  const [from, setFrom] = useState<'head' | 'tail'>(source === 'error' ? 'head' : 'tail');
  const [surface, setSurface] = useState<string>('all');
  const [paused, setPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [liveRows, setLiveRows] = useState<DisplayRow[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const didAutoPick = useRef(false);
  const surfaceRef = useRef(surface);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    surfaceRef.current = surface;
    // Reset file pick when surface changes so we load the right per-surface file
    didAutoPick.current = false;
    setSelectedFile('');
  }, [surface]);

  const sources = useMemo<SystemLogSource[]>(
    () => (source ? [source] : ['access', 'app', 'error']),
    [source]
  );

  const socketSurfaces = useMemo(
    () => (surface !== 'all' ? [surface] : undefined),
    [surface]
  );

  const showSurfaceFilter = !source || source === 'access';

  const { data: filesData, refetch: refetchFiles } = useGetSystemLogFilesQuery();

  const availableFiles = useMemo(() => {
    return (filesData?.files || []).filter((f) =>
      matchesSource(f, source, showSurfaceFilter ? surface : undefined)
    );
  }, [filesData, source, surface, showSurfaceFilter]);

  // Auto-pick newest non-empty file for this source (so rotated error-*.log shows up)
  useEffect(() => {
    if (didAutoPick.current || selectedFile) return;
    if (!availableFiles.length) return;

    const preferred =
      availableFiles.find((f) => f.sizeBytes > 0) || availableFiles[0];
    if (preferred) {
      setSelectedFile(preferred.path);
      didAutoPick.current = true;
    }
  }, [availableFiles, selectedFile]);

  const {
    data: history,
    isFetching,
    refetch,
  } = useGetSystemLogsQuery(
    {
      type: source || 'access',
      file: selectedFile || undefined,
      limit: initialLimit,
      keyword: keyword || undefined,
      level: level !== 'all' ? level : undefined,
      from,
      surface: showSurfaceFilter && surface !== 'all' ? surface : undefined,
    },
    { skip: !selectedFile && !!source }
  );

  // Live-all view: pull defaults for each type (backend falls back to newest non-empty)
  const { data: accessHistory } = useGetSystemLogsQuery(
    { type: 'access', limit: 80, from: 'tail' },
    { skip: !!source }
  );
  const { data: appHistory } = useGetSystemLogsQuery(
    { type: 'app', limit: 80, from: 'tail' },
    { skip: !!source }
  );
  const { data: errorHistory } = useGetSystemLogsQuery(
    { type: 'error', limit: 80, level: 'ERROR', from: 'head' },
    { skip: !!source }
  );

  const onEvent = useCallback(
    (event: SystemLogSocketEvent) => {
      if (pausedRef.current) return;
      if (source && event.source !== source) return;
      if (
        showSurfaceFilter &&
        surfaceRef.current !== 'all' &&
        event.source === 'access' &&
        (event.surface || event.entry?.surface) !== surfaceRef.current
      ) {
        return;
      }

      setLiveRows((prev) => {
        const next: DisplayRow = {
          id: entryKey(event.source, event.entry, Date.now()),
          source: event.source,
          entry: event.entry,
          live: true,
        };
        const merged = [...prev, next];
        return merged.length > MAX_LIVE_ENTRIES ? merged.slice(-MAX_LIVE_ENTRIES) : merged;
      });
    },
    [source, showSurfaceFilter]
  );

  const { status, isConnected } = useSystemLogsSocket({
    enabled: live,
    sources,
    surfaces: socketSurfaces,
    onEvent,
  });

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveRows, history, autoScroll]);

  const historicalRows: DisplayRow[] = useMemo(() => {
    if (source) {
      return (history?.entries || []).map((entry, i) => ({
        id: entryKey(source, entry, i),
        source,
        entry,
      }));
    }

    const access = (accessHistory?.entries || []).map((entry, i) => ({
      id: entryKey('access', entry, i),
      source: 'access',
      entry,
    }));
    const app = (appHistory?.entries || []).map((entry, i) => ({
      id: entryKey('app', entry, i),
      source: 'app',
      entry,
    }));
    const err = (errorHistory?.entries || []).map((entry, i) => ({
      id: entryKey('error', entry, i),
      source: 'error',
      entry,
    }));

    return [...access, ...app, ...err]
      .sort((a, b) => String(a.entry.time || '').localeCompare(String(b.entry.time || '')))
      .slice(-initialLimit);
  }, [source, history, accessHistory, appHistory, errorHistory, initialLimit]);

  const filteredHistorical = useMemo(() => {
    if (!keyword) return historicalRows;
    const q = keyword.toLowerCase();
    return historicalRows.filter((row) => JSON.stringify(row.entry).toLowerCase().includes(q));
  }, [historicalRows, keyword]);

  const filteredLive = useMemo(() => {
    if (!keyword) return liveRows;
    const q = keyword.toLowerCase();
    return liveRows.filter((row) => JSON.stringify(row.entry).toLowerCase().includes(q));
  }, [liveRows, keyword]);

  const clearLive = () => setLiveRows([]);

  const activeFileLabel = selectedFile || history?.file || accessHistory?.file || '—';

  return (
    <div className="space-y-4 px-4 pt-4 md:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="text-muted-foreground mt-1 text-sm">{description}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {live ? (
            <Badge
              variant="outline"
              className={cn(
                'font-medium',
                isConnected && 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
                status === 'error' && 'border-rose-500/40 text-rose-600',
                status === 'connecting' && 'border-amber-500/40 text-amber-600'
              )}
            >
              <span
                className={cn(
                  'mr-1.5 inline-block h-1.5 w-1.5 rounded-full',
                  isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'
                )}
              />
              {STATUS_LABEL[status]}
            </Badge>
          ) : null}
          <Badge variant="secondary" className="font-normal">
            {activeFileLabel}
          </Badge>
        </div>
      </div>

      <Card className="p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:flex-wrap">
          {source ? (
            <Select
              value={selectedFile || undefined}
              onValueChange={(value) => {
                setSelectedFile(value);
                didAutoPick.current = true;
              }}
            >
              <SelectTrigger className="w-full lg:max-w-sm">
                <SelectValue placeholder="Select log file…" />
              </SelectTrigger>
              <SelectContent>
                {availableFiles.map((f) => (
                  <SelectItem key={f.path} value={f.path}>
                    {f.path} · {f.sizeKb} KB
                    {f.isLive ? ' · live' : ''}
                    {f.sizeBytes === 0 ? ' · empty' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          {showSurfaceFilter ? (
            <Select value={surface} onValueChange={setSurface}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Surface" />
              </SelectTrigger>
              <SelectContent>
                {SURFACE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          <Select value={from} onValueChange={(v) => setFrom(v as 'head' | 'tail')}>
            <SelectTrigger className="w-full lg:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="head">From start (oldest)</SelectItem>
              <SelectItem value="tail">From end (newest)</SelectItem>
            </SelectContent>
          </Select>

          {(source === 'error' || source === 'app' || !source) && (
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full lg:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="ERROR">ERROR only</SelectItem>
                <SelectItem value="WARN">WARN only</SelectItem>
                <SelectItem value="INFO">INFO only</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Input
            placeholder="Filter keyword… (e.g. MongoDB)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="lg:max-w-xs"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                refetch();
                refetchFiles();
              }}
              disabled={isFetching}
            >
              <RefreshCw className={cn('mr-1.5 h-3.5 w-3.5', isFetching && 'animate-spin')} />
              Refresh
            </Button>
            {live ? (
              <>
                <Button type="button" variant="outline" size="sm" onClick={() => setPaused((p) => !p)}>
                  {paused ? (
                    <>
                      <Play className="mr-1.5 h-3.5 w-3.5" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="mr-1.5 h-3.5 w-3.5" /> Pause
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={clearLive}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear live
                </Button>
                <Button
                  type="button"
                  variant={autoScroll ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setAutoScroll((v) => !v)}
                >
                  Autoscroll {autoScroll ? 'on' : 'off'}
                </Button>
              </>
            ) : null}
          </div>
        </div>

        {source && availableFiles.length > 0 ? (
          <p className="text-muted-foreground mt-2 text-xs">
            Showing {filteredHistorical.length}
            {history?.meta?.totalLines != null ? ` of ${history.meta.totalLines}` : ''} lines
            {history?.file ? ` from ${history.file}` : ''}
            {from === 'head' ? ' (oldest first)' : ' (newest first)'}.
            {source === 'access'
              ? ' Folders: logs/access/{admin|app|organizer|staff|all}/'
              : source === 'error'
                ? ' Tip: use “From start” + ERROR only to see MongoDB failures.'
                : ''}
          </p>
        ) : null}
      </Card>

      <Card className="overflow-hidden border bg-zinc-950 text-zinc-100 dark:bg-zinc-950">
        <div className="border-b border-zinc-800 px-3 py-2 text-xs text-zinc-400">
          File output ({filteredHistorical.length})
          {live ? ` · Live buffer (${filteredLive.length})` : null}
          {paused ? ' · paused' : null}
        </div>
        <div className="h-[min(70vh,720px)] overflow-y-auto font-mono text-[12px] leading-5">
          {filteredHistorical.length === 0 && filteredLive.length === 0 ? (
            <div className="p-4 text-zinc-500">
              No log entries in this file. Try another file from the dropdown
              {source === 'error' ? ' (e.g. error-YYYY-MM-DD.log after rotation)' : ''}.
            </div>
          ) : null}

          {filteredHistorical.map((row) => (
            <LogLine key={row.id} row={row} />
          ))}

          {filteredLive.length > 0 ? (
            <div className="border-y border-emerald-900/50 bg-emerald-950/30 px-3 py-1 text-[11px] uppercase tracking-wide text-emerald-400">
              Live
            </div>
          ) : null}

          {filteredLive.map((row) => (
            <LogLine key={row.id} row={row} />
          ))}

          <div ref={bottomRef} />
        </div>
      </Card>
    </div>
  );
}

function LogLine({ row }: { row: DisplayRow }) {
  const time = row.entry.time ? new Date(String(row.entry.time)).toLocaleTimeString() : '';
  const surface = row.entry.surface ? String(row.entry.surface) : null;
  return (
    <div className="flex gap-2 border-b border-zinc-900/80 px-3 py-1 hover:bg-zinc-900/80">
      <span className="shrink-0 text-zinc-500">{time}</span>
      <span
        className={cn(
          'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase',
          SOURCE_COLORS[row.source] || 'bg-zinc-800 text-zinc-300'
        )}
      >
        {SOURCE_LABELS[row.source] || row.source}
      </span>
      {surface ? (
        <span className="shrink-0 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-zinc-300">
          {surface}
        </span>
      ) : null}
      <span className="min-w-0 break-all text-zinc-200">{formatEntry(row.entry, row.source)}</span>
    </div>
  );
}
