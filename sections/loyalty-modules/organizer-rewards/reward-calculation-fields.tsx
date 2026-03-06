'use client';

import { useRewardPointCalculatorMutation } from '@/store/Reducer/rewards-api';
import { getErrorMessage } from '@/utils/api';
import { AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CalculatorResponse {
  data?: {
    points?: number;
    totalSpend?: number;
    reason?: string;
  };
  message?: string;
  points?: number;
  totalSpend?: number;
  reason?: string;
}

const RewardCalculatorFields = () => {
  const [itemPrice, setItemPrice] = useState<string>('');
  const [calculatedPoints, setCalculatedPoints] = useState<number | null>(null);
  const [totalSpend, setTotalSpend] = useState<number | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [calculateRewardPoints, { isLoading: calculatingPoints }] = useRewardPointCalculatorMutation();

  // Call API whenever itemPrice changes
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Reset states
    setCalculatedPoints(null);
    setTotalSpend(null);
    setApiMessage(null);
    setReason(null);
    setError(null);

    if (!itemPrice) {
      return;
    }

    const price = parseFloat(itemPrice);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    // Debounce the API call by 500ms
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = (await calculateRewardPoints({
          data: {
            itemPrice: itemPrice,
          },
        }).unwrap()) as CalculatorResponse;

        // Extract points from response (handle different response structures)
        const points = response?.data?.points ?? response?.points;
        const spend = response?.data?.totalSpend ?? response?.totalSpend;
        const responseMessage = response?.message ?? null;
        const responseReason = response?.data?.reason ?? response?.reason ?? null;

        if (typeof points === 'number' && points >= 0) {
          setCalculatedPoints(points);
          setTotalSpend(typeof spend === 'number' ? spend : null);
          setApiMessage(responseMessage);
          setReason(responseReason);
          setError(null);
        } else {
          setError(responseMessage || 'Invalid response from server');
          setCalculatedPoints(null);
          setTotalSpend(null);
          setApiMessage(null);
          setReason(null);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage || 'Failed to calculate reward points');
        setCalculatedPoints(null);
        setTotalSpend(null);
        setApiMessage(null);
        setReason(null);
      }
    }, 500);

    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [itemPrice, calculateRewardPoints]);

  return (
    <div>
      <h2 className="mt-6 text-lg font-semibold">Reward Calculator</h2>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
        <div>
          <label className="mb-2 block text-sm font-medium">Item Price (€)</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              placeholder={'Enter item price'}
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              disabled={calculatingPoints}
              className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-[#212121] dark:text-white"
            />
            {calculatingPoints && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {calculatedPoints !== null && !error && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          {(apiMessage || reason) && (
            <div className="mb-3 text-center">{reason && <p className="text-sm text-amber-700 dark:text-amber-300">Reason: {reason}</p>}</div>
          )}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Calculated Point Value:</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{calculatedPoints} points</p>
            </div>
            {totalSpend !== null && (
              <div className="text-center">
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Total Spend:</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">€{totalSpend}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardCalculatorFields;
