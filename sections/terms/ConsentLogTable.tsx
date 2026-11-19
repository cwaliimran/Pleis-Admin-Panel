'use client';

import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetConsentLogsQuery } from '@/store/Reducer/legal';

const TYPE_LABELS: Record<string, string> = {
  terms_of_use: 'Terms of Use',
  privacy_policy: 'Privacy Policy',
  sales_terms: 'Sales Terms',
  partner_terms: 'Partner T&C',
  psa: 'PSA',
  loyalty_consent: 'Loyalty consent',
  withdrawal_waiver: 'Withdrawal waiver',
  age_16: '16+',
};

const LIMIT = 20;

/** Read-only view of the append-only consent log (records can never be edited or deleted). */
export default function ConsentLogTable() {
  const [page, setPage] = useState(1);
  const [documentType, setDocumentType] = useState<string>('all');
  const [user, setUser] = useState('');
  const validUser = /^[a-f0-9]{24}$/i.test(user.trim()) ? user.trim() : undefined;

  const { data, isFetching } = useGetConsentLogsQuery({
    page,
    limit: LIMIT,
    documentType: documentType === 'all' ? undefined : documentType,
    user: validUser,
  });
  const rows = data?.data || [];
  const totalPages = Math.max(1, data?.meta?.totalPages || 1);

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Every acceptance and withdrawal is stored as an immutable record (who, document, version, time, context, IP / device / platform).
      </p>
      <div className="flex flex-wrap gap-2">
        <Select
          value={documentType}
          onValueChange={(v) => {
            setDocumentType(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Document" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All documents</SelectItem>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="w-[260px]"
          placeholder="Filter by user ID"
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Accepted at (UTC)</TableHead>
              <TableHead>Who</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Context</TableHead>
              <TableHead>IP / platform / device</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground py-6 text-center">
                  {isFetching ? 'Loading…' : 'No consent records'}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="whitespace-nowrap">{new Date(r.acceptedAt).toISOString().replace('T', ' ').slice(0, 19)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{[r.user?.firstName, r.user?.lastName].filter(Boolean).join(' ') || '—'}</div>
                    <div className="text-muted-foreground text-xs">
                      {r.user?.email} · {r.subjectType}
                    </div>
                  </TableCell>
                  <TableCell>{TYPE_LABELS[r.documentType] || r.documentType}</TableCell>
                  <TableCell>v{r.documentVersion}</TableCell>
                  <TableCell>
                    <Badge variant={r.action === 'withdrawn' ? 'destructive' : 'secondary'}>{r.action}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {r.context?.source}
                    {r.context?.organizerName ? ` · ${r.context.organizerName}` : ''}
                    {r.context?.orderId ? ` · order ${r.context.orderId}` : ''}
                  </TableCell>
                  <TableCell className="text-xs">
                    {r.ip || '—'} · {r.platform || '—'}
                    {r.device?.deviceId ? ` · ${r.device.deviceId}` : ''}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2 text-sm">
        <Button variant="outline" size="sm" disabled={page <= 1 || isFetching} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <span>
          Page {page} / {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={page >= totalPages || isFetching} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
