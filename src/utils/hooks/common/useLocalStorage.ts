import useLocalStorageState, {
  type LocalStorageOptions,
} from 'use-local-storage-state';

/**
 * Custom hook for managing state in local storage.
 * @param keyName - The key for the local storage item
 * @param initialValue - The initial value for the local storage item
 * @param options - Additional options for managing local storage
 * @returns The state value from local storage
 */
export default function useLocalStorage<T>(
  keyName: string,
  initialValue?: T,
  options?: Omit<LocalStorageOptions<unknown>, 'defaultValue'>
) {
  const state = useLocalStorageState(keyName, {
    defaultValue: initialValue,
    ...options,
  });
  return state;
}
