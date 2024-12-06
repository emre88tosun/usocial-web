/**
 * Generates a safe string representation of the given value.
 * @param value - The value to be converted to a string.
 * @returns The safe string representation of the value.
 */
export default function safeString(value: unknown) {
  if (value === 'null' || value === 'undefined' || !value) return '';
  if (typeof value === 'number' && value === 0) return '0';
  if (
    typeof value === 'function' ||
    typeof value === 'object' ||
    typeof value === 'symbol'
  )
    return '';
  return value ? String(value) : '';
}
