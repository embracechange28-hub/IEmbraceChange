export const menotrackerKeys: readonly string[];
export type MenotrackerKey = typeof menotrackerKeys[number];
export function isMenotrackerKey(k: string): k is MenotrackerKey;
