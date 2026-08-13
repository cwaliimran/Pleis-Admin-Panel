'use client';

import { Input } from '@/components/ui/input';
import { useRewardPointCalculatorMutation } from '@/store/Reducer/rewards-api';
import { getErrorMessage } from '@/utils/api';
import { AlertCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { CALCULATOR_DEBOUNCE_MS } from './constants';

interface CalculatorResponse {
  data?: { points?: number; totalSpend?: number; reason?: string };
  message?: string;
  points?: number;
  totalSpend?: number;
  reason?: string;
}

interface RewardCalculatorPanelProps {
  companyOrganizer?: string;
}

interface CalculatorResult {
  points: number;
  totalSpend: number | null;
  reason: string | null;
}

/**
 * Suggests a point value from an item price, using the same points-calculator
 * endpoint as the v1 reward modal. Debounced so typing a price does not fire a
 * request per keystroke.
 */
export const RewardCalculatorPanel: React.FC<RewardCalculatorPanelProps> = ({ companyOrganizer }) => {
  const [itemPrice, setItemPrice] = useState('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [calculateRewardPoints, { isLoading }] = useRewardPointCalculatorMutation();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setResult(null);
    setError(null);

    if (!itemPrice) return;

    if (!companyOrganizer) {
      setError('Please select a company first');
      return;
    }

    const price = Number(itemPrice);
    if (Number.isNaN(price) || price <= 0) {
      setError('Enter a price greater than 0.');
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const response = (await calculateRewardPoints({
          data: { companyOrganizer, itemPrice },
        }).unwrap()) as CalculatorResponse;

        // The endpoint has been seen returning the figures both nested and flat.
        const points = response?.data?.points ?? response?.points;
        const totalSpend = response?.data?.totalSpend ?? response?.totalSpend ?? null;
        const reason = response?.data?.reason ?? response?.reason ?? null;

        if (typeof points !== 'number' || points < 0) {
          setError(response?.message || 'Invalid response from server');
          return;
        }

        setResult({ points, totalSpend: typeof totalSpend === 'number' ? totalSpend : null, reason });
      } catch (caught) {
        setError(getErrorMessage(caught) || 'Failed to calculate reward points');
      }
    }, CALCULATOR_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [itemPrice, companyOrganizer, calculateRewardPoints]);

  return (
    <div className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Reward Calculator</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Enter an item price to get a suggested point value.</p>

      <div className="mt-3 flex flex-col gap-2">
        <label htmlFor="reward-item-price" className="text-sm font-medium">
          Item Price (€)
        </label>

        <div className="relative">
          <Input
            id="reward-item-price"
            type="number"
            step="0.01"
            min="0"
            placeholder={companyOrganizer ? 'Enter item price' : 'Select a company first'}
            value={itemPrice}
            disabled={!companyOrganizer}
            onChange={(event) => setItemPrice(event.target.value)}
            className="h-10 w-full"
          />
          {isLoading && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900/60 dark:bg-red-900/20">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {result && !error && (
        <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-900/60 dark:bg-emerald-900/20">
          {result.reason && <p className="mb-2 text-xs text-amber-700 dark:text-amber-300">Reason: {result.reason}</p>}

          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Suggested point value</p>
              <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">{result.points.toLocaleString()} points</p>
            </div>

            {result.totalSpend !== null && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-300">Total spend</p>
                <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">€{result.totalSpend}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardCalculatorPanel;
