import { STORAGE_KEY } from "@/lib/constants";
import type { StoryState } from "@/lib/types";

/**
 * Data access boundary for the storybook.
 *
 * Screens talk to StoryProvider, and the provider talks to a StoryRepository.
 * Replacing LocalStorageStoryRepository with Supabase Auth, Database, and
 * Storage should not require rewriting the UI. Photo fields are data URLs in
 * this MVP and should become storage paths in production.
 */
export interface StoryRepository {
  load(): Promise<StoryState>;
  save(state: StoryState): Promise<void>;
}

export function emptyState(): StoryState {
  return {
    version: 1,
    couple: null,
    partners: [],
    memories: [],
    bookDrafts: [],
  };
}

function isStoryState(value: unknown): value is StoryState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<StoryState>;
  return (
    state.version === 1 &&
    Array.isArray(state.partners) &&
    Array.isArray(state.memories) &&
    Array.isArray(state.bookDrafts)
  );
}

export const localStorageRepository: StoryRepository = {
  async load() {
    if (typeof window === "undefined") return emptyState();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      const parsed: unknown = JSON.parse(raw);
      if (!isStoryState(parsed)) return emptyState();
      return {
        ...emptyState(),
        ...parsed,
        couple: parsed.couple ?? null,
      };
    } catch {
      return emptyState();
    }
  },

  async save(state) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
};
