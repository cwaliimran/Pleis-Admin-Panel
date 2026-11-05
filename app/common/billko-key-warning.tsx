'use client';

import { BILLKO_KEY_PROFILE_HREF, isBillkoKeyMissing } from '@/utils/billko';
import { RootState } from '@/store/store';
import { TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const TOAST_ID = 'billko-api-key-warning';

/**
 * Persistent top-centre warning shown to organizers who have not configured a
 * Billko API key yet.
 *
 * Mounted once in the organizer layout, so it survives client-side navigation
 * and follows the user across every page. `duration: Infinity` plus a fixed id
 * keeps exactly one toast on screen until the key is saved — at which point the
 * updated user lands in Redux, `missing` flips, and the effect dismisses it.
 *
 * The toast body renders inside react-hot-toast's <Toaster>, which sits outside
 * the Redux provider in the root layout, so it must not use hooks — everything
 * it needs is captured in the closure below.
 */
const BillkoKeyWarning = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.userSlice);

  const missing = isBillkoKeyMissing(user);

  useEffect(() => {
    if (!missing) {
      toast.dismiss(TOAST_ID);
      return;
    }

    toast.custom(
      (t) => (
        <div
          role="alert"
          className={`pointer-events-auto flex w-[92vw] max-w-3xl items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-lg transition-opacity duration-200 dark:border-amber-500/40 dark:bg-[#2b2417] ${
            t.visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Billko API key missing</p>
            <p className="mt-0.5 text-sm text-amber-800 dark:text-amber-300/90">
              Add your Billko API key in Business Details to finish setting up your account.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push(BILLKO_KEY_PROFILE_HREF)}
            className="shrink-0 cursor-pointer rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Add key
          </button>
        </div>
      ),
      { id: TOAST_ID, duration: Infinity, position: 'top-center' }
    );

    return () => {
      toast.dismiss(TOAST_ID);
    };
  }, [missing, router]);

  return null;
};

export default BillkoKeyWarning;
