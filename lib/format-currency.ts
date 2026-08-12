/**
 * Formats a whole naira number into comma-separated string with trailing ₦ symbol.
 * Example: 100000 -> "100,000₦"
 * Example: 5000 -> "5,000₦"
 */
export function formatNaira(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') {
    return '0₦';
  }
  const numericVal = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericVal)) {
    return '0₦';
  }
  const roundedInt = Math.round(numericVal);
  return `${roundedInt.toLocaleString('en-US')}₦`;
}
