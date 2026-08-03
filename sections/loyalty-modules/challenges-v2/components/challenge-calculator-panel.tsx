'use client';

import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { POINTS_PER_EURO } from '../constants';

/**
 * Suggests a point value from an item price. Mocked locally at a flat
 * points-per-euro rate — swap for the points-calculator endpoint when the V2
 * one exists.
 */
export const ChallengeCalculatorPanel: React.FC = () => {
  const [itemPrice, setItemPrice] = useState('');

  const price = Number(itemPrice);
  const isValid = itemPrice !== '' && !Number.isNaN(price) && price > 0;
  const suggestedPoints = isValid ? Math.round(price * POINTS_PER_EURO) : null;

  return (
    <div className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Reward Calculator</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Enter an item price to get a suggested point value.</p>

      <div className="mt-3 flex flex-col gap-2">
        <label htmlFor="challenge-item-price" className="text-sm font-medium">
          Item Price (€)
        </label>
        <Input
          id="challenge-item-price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter item price"
          value={itemPrice}
          onChange={(event) => setItemPrice(event.target.value)}
          className="h-10 w-full"
        />
      </div>

      {itemPrice !== '' && !isValid && <p className="mt-2 text-xs text-red-600 dark:text-red-400">Enter a price greater than 0.</p>}

      {suggestedPoints !== null && (
        <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-900/60 dark:bg-emerald-900/20">
          <p className="text-xs text-gray-600 dark:text-gray-300">Suggested point value</p>
          <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">{suggestedPoints.toLocaleString()} points</p>
        </div>
      )}
    </div>
  );
};

export default ChallengeCalculatorPanel;
