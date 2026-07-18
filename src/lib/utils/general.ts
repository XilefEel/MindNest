import { appDataDir, appLocalDataDir, join } from "@tauri-apps/api/path";
import { openPath } from "@tauri-apps/plugin-opener";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const withStoreErrorHandler = <
  TState extends { loading: boolean },
  TArgs extends any[],
  TResult,
>(
  set: (
    partial: Partial<TState> | ((state: TState) => Partial<TState>),
  ) => void,
  storeFn: (...args: TArgs) => Promise<TResult>,
) => {
  return async (...args: TArgs): Promise<TResult> => {
    set({ loading: true } as Partial<TState>);
    try {
      return await storeFn(...args);
    } catch (error) {
      console.error(`Error in store function: ${error}`);
      throw error;
    } finally {
      set({ loading: false } as Partial<TState>);
    }
  };
};

export const mergeWithCurrent = <T extends Record<string, any>>(
  current: T,
  updates: Partial<T>,
): T => ({
  ...current,
  ...Object.fromEntries(
    Object.entries(updates).filter(([_, value]) => value !== undefined),
  ),
});

export const sortByFavorite = <
  T extends { isFavorite: boolean; createdAt: string | Date },
>(
  items: T[],
) =>
  items.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

type RoamingFolder = "backgrounds" | "music" | "gallery";

type LocalFolder = "logs";

type OpenFolderOptions =
  | { location?: "roaming"; subfolder?: RoamingFolder }
  | { location: "local"; subfolder?: LocalFolder };

export const openAppFolder = async (
  options: OpenFolderOptions = { location: "roaming" },
): Promise<void> => {
  const base =
    options.location === "local" ? await appLocalDataDir() : await appDataDir();

  const targetPath = options.subfolder
    ? await join(base, options.subfolder)
    : base;

  await openPath(targetPath);
};
