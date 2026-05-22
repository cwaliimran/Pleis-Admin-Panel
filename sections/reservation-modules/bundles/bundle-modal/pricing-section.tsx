import { RHFTextField } from '@/components/rhf';

type PricingSectionProps = {
  originalPrice: number;
  bundlePrice: number;
  discount: number;
};

const PricingSection = ({ originalPrice, bundlePrice, discount }: PricingSectionProps) => {
  return (
    <div className="rounded-xl border-2 border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
      <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-gray-200 dark:text-black">
          3
        </div>
        <span className="dark:text-gray-100">Set Bundle Price</span>
      </h3>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-800 dark:bg-gray-900">
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Original Price</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">€{originalPrice}</div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Sum of all items</div>
        </div>

        <div>
          <RHFTextField
            type="number"
            name="price"
            placeholder="0"
            label="Bundle Price (EUR)"
            className="h-11 border border-gray-300 bg-white dark:border-gray-500"
            step={0.1}
            min={0}
          />
        </div>
      </div>

      {bundlePrice > 0 && originalPrice > 0 && (
        <div
          className={`rounded-lg p-4 ${
            parseFloat(String(bundlePrice)) < originalPrice
              ? 'border-2 border-green-300 bg-green-100 dark:border-green-800 dark:bg-green-900/20'
              : 'border-2 border-amber-300 bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div
                  className={`font-semibold ${
                    parseFloat(String(bundlePrice)) < originalPrice ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {parseFloat(String(bundlePrice)) < originalPrice ? 'Great Deal!' : 'Price Warning'}
                </div>
                <div
                  className={`text-sm ${
                    parseFloat(String(bundlePrice)) < originalPrice ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {parseFloat(String(bundlePrice)) < originalPrice
                    ? `Customers save €${(originalPrice - parseFloat(String(bundlePrice))).toFixed(2)} (${discount}% discount)`
                    : 'Bundle price is higher than original price. Consider adjusting.'}
                </div>
              </div>
            </div>
            {parseFloat(String(bundlePrice)) < originalPrice && (
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{discount}%</div>
                <div className="text-xs text-green-700 dark:text-green-500">OFF</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingSection;
