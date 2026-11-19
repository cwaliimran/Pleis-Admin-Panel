'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { LegalDocument, useAcceptLegalDocumentsMutation, useGetLegalStatusQuery } from '@/store/Reducer/legal';
import { logout, setUser } from '@/store/slice/userSlice';
import { resetStore, RootState } from '@/store/store';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import '@/app/common/terms-html.css';

// Checkbox wording from the spec (1.3 Partner registration).
const CHECKBOX_LABEL: Record<string, { before: string; link: string }> = {
  partner_terms: { before: 'I accept the ', link: 'Partner Terms and Conditions' },
  privacy_policy: { before: 'I have read the ', link: 'Privacy Policy' },
};

const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString('hr-HR') : '');

/**
 * Hard gate for the Partner Dashboard (spec 1.3 + 1.5 + 5): until the partner has accepted
 * the current Partner T&C and Privacy Policy, the dashboard is NOT rendered at all — only
 * this screen. Also covers re-acceptance after a new version (change notice with summary
 * and effective date, acknowledged on next login).
 */
export default function PartnerLegalGate({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.userSlice);
  const userType = user?.accountState?.userType || user?.role;
  const skip = !user?.token || userType === 'admin';

  const { data, isLoading, isError, refetch } = useGetLegalStatusQuery(undefined, { skip, refetchOnMountOrArgChange: true });
  const [accept, { isLoading: isAccepting }] = useAcceptLegalDocumentsMutation();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [viewing, setViewing] = useState<LegalDocument | null>(null);

  const pending = data?.data?.pending || [];
  useEffect(() => setChecked({}), [pending.map((p) => `${p.type}@${p.version}`).join(',')]);

  if (skip) return <>{children}</>;

  if (isLoading || (!data && !isError)) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (isError) {
    // Fail closed: never show the dashboard without knowing the acceptance state.
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <p>We could not verify your acceptance of the Partner Terms. Please try again.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!pending.length) return <>{children}</>;

  const allChecked = pending.every((p) => checked[p.type]);
  const isUpdate = pending.some((p) => p.isReacceptance);

  const handleAccept = async () => {
    try {
      await accept({ acceptances: pending.map((p) => ({ type: p.type, version: p.version })) }).unwrap();
      // Keep the legacy flag in the stored user in sync with the backend.
      dispatch(setUser({ ...user, accountState: { ...(user?.accountState || {}), termsAccepted: true } }));
      showSuccess('Thank you — your acceptance has been recorded.');
      refetch();
    } catch (error) {
      showError(getErrorMessage(error));
      refetch();
    }
  };

  const handleLogout = () => {
    dispatch(resetStore());
    dispatch(logout());
    localStorage.clear();
    router.replace('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f6f7] p-4 dark:bg-black">
      <div className="dark:bg-secondary w-full max-w-xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{isUpdate ? 'Updated legal documents' : 'Before you continue'}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {isUpdate
            ? 'We have updated the documents below. Please review and accept them to keep using the Partner Dashboard.'
            : 'To use the Partner Dashboard, please accept the following documents.'}
        </p>

        {pending
          .filter((p) => p.isReacceptance)
          .map((p) => (
            <div key={`notice-${p.type}`} className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-700 dark:bg-amber-950/40">
              <div className="font-semibold">
                {p.title} — version {p.version}
                {p.effectiveDate ? `, effective ${formatDate(p.effectiveDate)}` : ''}
              </div>
              {p.summary ? <div className="mt-1">{p.summary}</div> : null}
            </div>
          ))}

        <div className="mt-5 space-y-4">
          {pending.map((p) => {
            const label = CHECKBOX_LABEL[p.type] || { before: 'I accept the ', link: p.title };
            return (
              <div key={p.type} className="flex items-start gap-3">
                <Checkbox
                  id={`legal-${p.type}`}
                  checked={!!checked[p.type]}
                  onCheckedChange={(v) => setChecked((c) => ({ ...c, [p.type]: v === true }))}
                  className="mt-0.5 cursor-pointer border border-black dark:border-white"
                />
                <label htmlFor={`legal-${p.type}`} className="cursor-pointer text-sm leading-snug">
                  {label.before}
                  <button type="button" className="text-primary font-medium underline" onClick={() => setViewing(p)}>
                    {label.link}
                  </button>
                  .
                </label>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
          <Button onClick={handleAccept} disabled={!allChecked || isAccepting}>
            {isAccepting ? 'Processing…' : 'Accept and continue'}
          </Button>
        </div>
      </div>

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
