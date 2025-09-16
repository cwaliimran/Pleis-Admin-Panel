'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { useMemo, useState } from 'react';

const RewardsCalculator = () => {
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

  const handleReset = () => {
    setItemPrice('');
    setPointsPerEuro('');
  };

  return (
    <Card className="dark:bg-secondary mt-3 w-full flex-1 gap-2 rounded-lg px-6 py-8">
      <div className="mb-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <span className="text-lg font-semibold">Reward Calculator</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-xs"
        >
          Reset
        </Button>
      </div>

      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Use this calculator to determine the appropriate point value for menu
        item rewards.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-[#212121] dark:text-white"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-[#212121] dark:text-white"
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
    </Card>
  );
};

export default RewardsCalculator;
