import type { MasterData } from "./types";

let cachedData: MasterData | null = null;

/**
 * Loads and returns the master data payload from public/data/master.json.
 * Caches the result in memory for subsequent calls.
 *
 * @throws Will throw if the fetch fails or JSON is malformed.
 */
export async function loadMasterData(): Promise<MasterData> {
  if (cachedData) return cachedData;

  const response = await fetch("/data/master.json");

  if (!response.ok) {
    throw new Error(
      `Failed to load master data: ${response.status} ${response.statusText}`
    );
  }

  const data: MasterData = await response.json();
  cachedData = data;
  return data;
}
