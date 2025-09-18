'use client';

import { useMemo, useState } from 'react';

const RewardCalculatorFields = () => {
  const [itemPrice, setItemPrice] = useState<string>('');
  const [pointsPerEuro, setPointsPerEuro] = useState<string>('');

  const calculatedPoints = useMemo(() => {
    const price = parseFloat(itemPrice);
    const points = parseFloat(pointsPerEuro);
    if (price && points) {
      return Math.round(price * points);
    }
    return null;
  }, [itemPrice, pointsPerEuro]);

  return (
    <div>
      <h2 className="mt-6 text-lg font-semibold">Reward Calculator</h2>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Item Price (€)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Enter item price"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-[#212121] dark:text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Points</label>
          <input
            type="number"
            step="0.1"
            placeholder="Enter points"
            value={pointsPerEuro}
            onChange={(e) => setPointsPerEuro(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-[#212121] dark:text-white"
          />
        </div>
      </div>

      {/* Result Display */}
      {calculatedPoints !== null && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="text-center">
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              Calculated Point Value:
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {calculatedPoints} points
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardCalculatorFields;
