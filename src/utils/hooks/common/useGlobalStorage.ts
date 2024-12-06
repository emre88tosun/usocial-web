import { useReState } from '@raulpesilva/re-state';

/**
 * Global temporary state
 * @param key - The key for global state item
 * @param initialValue - Initial value for global state item
 * @returns The value from global state
 */
export default function useGlobalStorage<T>(key: string, initialValue?: T) {
  return useReState<T>(key, initialValue);
}
