'use client';

import React, { useState } from 'react';
import { Download, Eye } from 'lucide-react';

import { AppLoading } from '@/components/atoms/app-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { legalDocumentPdfUrl, MyLegalDocument, useGetMyLegalDocumentsQuery } from '@/store/Reducer/legal';
import '@/app/common/terms-html.css';

const formatDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString('hr-HR') : '');

// The DPA is Annex 3 of the PSA and is accepted in the same step, with no separate record (spec 1.4).
function AcceptanceBadge({ doc, psa }: { doc: MyLegalDocument; psa?: MyLegalDocument }) {
  if (!doc.published) return <Badge variant="outline">Not published yet</Badge>;
  if (doc.acceptedVersion) {
    const outdated = doc.version && doc.acceptedVersion < doc.version;
    return (
      <Badge variant={outdated ? 'outline' : 'secondary'}>
        Accepted v{doc.acceptedVersion}
        {doc.acceptedAt ? ` · ${formatDate(doc.acceptedAt)}` : ''}
      </Badge>
    );
  }
  if (doc.type === 'dpa' && psa?.acceptedVersion) {
    return <Badge variant="secondary">Accepted with the PSA{psa.acceptedAt ? ` · ${formatDate(psa.acceptedAt)}` : ''}</Badge>;
  }
  return <Badge variant="outline">Not accepted</Badge>;
}

/**
 * Partner Dashboard → Legal (PLEIS Legal spec 1.5, Requirement Set #101):
 * Partner Terms and Conditions, Partner Service Agreement (download PDF), DPA, Privacy Policy.
 * The change notice for a new Partner T&C version is acknowledged in PartnerLegalGate on login;
 * the latest summary of changes stays visible here.
 */
export default function PartnerLegalView() {
  const { data, isLoading, isError, refetch } = useGetMyLegalDocumentsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [viewing, setViewing] = useState<MyLegalDocument | null>(null);

  if (isLoading) return <AppLoading />;

  const documents = data?.data?.documents || [];
  const partnerTerms = documents.find((d) => d.type === 'partner_terms');
  const psa = documents.find((d) => d.type === 'psa');

  return (
    <div className="container mx-auto w-full p-6">
      <Card className="dark:bg-secondary w-full">
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl">Legal</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isError ? (
            <div className="flex flex-col items-start gap-2 text-sm">
              <p>The legal documents could not be loaded.</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : null}

          {partnerTerms?.published && partnerTerms.version && partnerTerms.version > 1 && partnerTerms.summary ? (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-700 dark:bg-amber-950/40">
              <div className="font-semibold">
                {partnerTerms.title} — version {partnerTerms.version}
                {partnerTerms.effectiveDate ? `, effective ${formatDate(partnerTerms.effectiveDate)}` : ''}
              </div>
              <div className="mt-1 whitespace-pre-line">{partnerTerms.summary}</div>
            </div>
          ) : null}

          <ul className="divide-y rounded-md border dark:divide-gray-700 dark:border-gray-700">
            {documents.map((doc) => (
              <li key={doc.type} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {doc.published ? `Version ${doc.version}${doc.effectiveDate ? ` · effective ${formatDate(doc.effectiveDate)}` : ''}` : '—'}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AcceptanceBadge doc={doc} psa={psa} />
                  <Button variant="outline" size="sm" disabled={!doc.published} onClick={() => setViewing(doc)} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" /> View
                  </Button>
                  {doc.published ? (
                    <Button variant="outline" size="sm" asChild className="flex items-center gap-2">
                      <a href={legalDocumentPdfUrl(doc.type, doc.version)} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" /> Download PDF
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[90vh] w-full flex-col md:max-w-[760px]!">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {viewing?.title} <span className="text-muted-foreground text-sm font-normal">v{viewing?.version}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto pr-2">
            <div className="terms-html" dangerouslySetInnerHTML={{ __html: viewing?.content || '' }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
