import { clsx, type ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | null;
  const debounced = (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
  };

  return debounced as T & { cancel: () => void };
}

export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const withStoreErrorHandler = <
  TState extends { loading: boolean; error: string | null },
  TArgs extends any[],
  TResult,
>(
  set: (
    partial: Partial<TState> | ((state: TState) => Partial<TState>),
  ) => void,
  storeFn: (...args: TArgs) => Promise<TResult>,
) => {
  return async (...args: TArgs): Promise<TResult> => {
    set({ loading: true, error: null } as Partial<TState>);
    try {
      const result = await storeFn(...args);
      return result;
    } catch (error) {
      set({ error: String(error) } as Partial<TState>);
      throw error;
    } finally {
      set({ loading: false } as Partial<TState>);
    }
  };
};

export const mergeWithCurrent = <T extends Record<string, any>>(
  current: T,
  updates: Partial<T>,
): T => {
  const result = { ...current };
  for (const key in updates) {
    if (updates[key] !== undefined) result[key] = updates[key];
  }
  return result;
};
