/**
 * Validates a Croatian IBAN using the MOD 97 algorithm.
 *
 * Format: HR kk bbbb bbbb cccc cccc c (21 chars without spaces)
 *   HR   — country code
 *   kk   — 2 check digits
 *   bbbb bbbb — 8-digit bank identifier
 *   cccc cccc c — 9-digit account number
 *
 * Spaces in the input are ignored. The value is case-insensitive.
 */
export function validateCroatianIBAN(value: string): boolean {
  const iban = value.replace(/\s/g, '').toUpperCase();

  if (iban.length !== 21) return false;
  if (!iban.startsWith('HR')) return false;

  // Move the first 4 characters to the end
  const rearranged = iban.slice(4) + iban.slice(0, 4);

  // Replace each letter with its numeric equivalent: A=10, B=11, ..., Z=35
  const numericString = rearranged.replace(/[A-Z]/g, (ch) =>
    (ch.charCodeAt(0) - 55).toString()
  );

  // Compute MOD 97 iteratively to handle the large number
  let remainder = 0;
  for (const digit of numericString) {
    remainder = (remainder * 10 + parseInt(digit, 10)) % 97;
  }

  return remainder === 1;
}
