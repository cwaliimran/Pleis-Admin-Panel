/**
 * Formats a number into a compact human-readable string.
 *
 * Handles the full scale:
 *   1,200        → "1.2K"
 *   5,400,000    → "5.4M"
 *   3,600,000,000 → "3.6B"
 *   1.2 Trillion  → "1.2T"
 *   3.2 Quadrillion → "3.2Q"
 *   32,480,000,000,000,000,000 → "32.5Q" (Quintillions shown as Q with extra magnitude)
 *
 * Small numbers (< 1000) are returned as-is with commas / decimals.
 */

const SUFFIXES: [number, string][] = [
  [1e18, 'Qi'], // Quintillion
  [1e15, 'Q'],  // Quadrillion
  [1e12, 'T'],  // Trillion
  [1e9, 'B'],   // Billion
  [1e6, 'M'],   // Million
  [1e3, 'K'],   // Thousand
];

export const formatCompactNumber = (value: number): string => {
  const abs = Math.abs(value);

  for (const [threshold, suffix] of SUFFIXES) {
    if (abs >= threshold) {
      const scaled = value / threshold;
      // Use 1 decimal place, but drop ".0" for cleaner display
      const formatted = scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1);
      return `${formatted}${suffix}`;
    }
  }

  // Small numbers — show full value
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
};