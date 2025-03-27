import { StateCreator } from 'zustand';

// Define a simplified logger middleware
export const logger = <T extends unknown>(f: StateCreator<T>) => (
  set: any,
  get: any,
  store: any
): any => {
  return f(
    (...args: any) => {
      console.log('  applying', args);
      set(...args);
      console.log('  new state', get());
    },
    get,
    store
  );
};

/* Example usage:
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './middleware/logger';

export const useStore = create(
  logger(
    persist(
      (set) => ({
        // state and actions
      }),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => AsyncStorage)
      }
    )
  )
);
*/ 