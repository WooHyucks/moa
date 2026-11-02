"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { emptyState, localStorageRepository } from "@/lib/repository";
import type {
  BookDraft,
  CoverStyle,
  Memory,
  MemoryInput,
  OnboardingInput,
  StoryState,
} from "@/lib/types";

interface StoryContextValue {
  ready: boolean;
  state: StoryState;
  startStory: (input: OnboardingInput) => Promise<void>;
  updateCoupleProfile: (input: OnboardingInput) => Promise<void>;
  addMemory: (input: MemoryInput) => Promise<Memory>;
  updateMemory: (id: string, input: MemoryInput) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  saveBookDraft: (draft: BookDraft) => Promise<void>;
  setBookCoverStyle: (volume: number, coverStyle: CoverStyle) => Promise<void>;
  clearBookDraft: (volume: number) => Promise<void>;
  resetStory: () => Promise<void>;
}

const StoryContext = createContext<StoryContextValue | null>(null);

function blankToUndefined(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoryState>(emptyState);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);

  useEffect(() => {
    let cancelled = false;
    localStorageRepository.load().then((loaded) => {
      if (cancelled) return;
      stateRef.current = loaded;
      setState(loaded);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const commit = useCallback(async (updater: (prev: StoryState) => StoryState) => {
    const prev = stateRef.current;
    const next = updater(prev);
    stateRef.current = next;
    setState(next);
    try {
      await localStorageRepository.save(next);
      return next;
    } catch (error) {
      stateRef.current = prev;
      setState(prev);
      throw error;
    }
  }, []);

  const startStory = useCallback(
    async (input: OnboardingInput) => {
      const now = new Date().toISOString();
      const coupleId = crypto.randomUUID();
      await commit(() => ({
        version: 1,
        couple: {
          id: coupleId,
          startDate: input.startDate,
          createdAt: now,
        },
        partners: [
          {
            id: crypto.randomUUID(),
            coupleId,
            name: input.myName.trim(),
            nickname: blankToUndefined(input.myNickname),
            ageRange: blankToUndefined(input.myAgeRange),
            mbti: blankToUndefined(input.myMbti),
            isSelf: true,
          },
          {
            id: crypto.randomUUID(),
            coupleId,
            name: input.partnerName.trim(),
            nickname: blankToUndefined(input.partnerNickname),
            ageRange: blankToUndefined(input.partnerAgeRange),
            mbti: blankToUndefined(input.partnerMbti),
            isSelf: false,
          },
        ],
        memories: [],
        bookDrafts: [],
      }));
    },
    [commit],
  );

  const updateCoupleProfile = useCallback(
    async (input: OnboardingInput) => {
      await commit((prev) => {
        if (!prev.couple) return prev;
        return {
          ...prev,
          couple: {
            ...prev.couple,
            startDate: input.startDate,
          },
          partners: prev.partners.map((partner) =>
            partner.isSelf
              ? {
                  ...partner,
                  name: input.myName.trim(),
                  nickname: blankToUndefined(input.myNickname),
                  ageRange: blankToUndefined(input.myAgeRange),
                  mbti: blankToUndefined(input.myMbti),
                }
              : {
                  ...partner,
                  name: input.partnerName.trim(),
                  nickname: blankToUndefined(input.partnerNickname),
                  ageRange: blankToUndefined(input.partnerAgeRange),
                  mbti: blankToUndefined(input.partnerMbti),
                },
          ),
        };
      });
    },
    [commit],
  );

  const addMemory = useCallback(
    async (input: MemoryInput) => {
      const current = stateRef.current;
      if (!current.couple) throw new Error("couple-missing");
      const author = current.partners.find((partner) => partner.isSelf);
      if (!author) throw new Error("author-missing");
      const now = new Date().toISOString();
      const memory: Memory = {
        id: crypto.randomUUID(),
        coupleId: current.couple.id,
        authorId: author.id,
        date: input.date,
        emotion: input.emotion,
        content: blankToUndefined(input.content),
        photos: input.photos,
        createdAt: now,
        updatedAt: now,
      };
      await commit((prev) => ({
        ...prev,
        memories: [memory, ...prev.memories],
      }));
      return memory;
    },
    [commit],
  );

  const updateMemory = useCallback(
    async (id: string, input: MemoryInput) => {
      await commit((prev) => ({
        ...prev,
        memories: prev.memories.map((memory) =>
          memory.id === id
            ? {
                ...memory,
                date: input.date,
                emotion: input.emotion,
                content: blankToUndefined(input.content),
                photos: input.photos,
                updatedAt: new Date().toISOString(),
              }
            : memory,
        ),
      }));
    },
    [commit],
  );

  const deleteMemory = useCallback(
    async (id: string) => {
      await commit((prev) => ({
        ...prev,
        memories: prev.memories.filter((memory) => memory.id !== id),
      }));
    },
    [commit],
  );

  const saveBookDraft = useCallback(
    async (draft: BookDraft) => {
      await commit((prev) => {
        const previous = prev.bookDrafts.find((item) => item.volume === draft.volume);
        const merged: BookDraft = {
          ...draft,
          coverStyle: draft.coverStyle ?? previous?.coverStyle,
        };
        return {
          ...prev,
          bookDrafts: [
            merged,
            ...prev.bookDrafts.filter((item) => item.volume !== draft.volume),
          ],
        };
      });
    },
    [commit],
  );

  const setBookCoverStyle = useCallback(
    async (volume: number, coverStyle: CoverStyle) => {
      await commit((prev) => {
        const current = prev.bookDrafts.find((item) => item.volume === volume);
        const next: BookDraft = current
          ? {
              ...current,
              coverStyle,
              updatedAt: new Date().toISOString(),
            }
          : {
              volume,
              title: "",
              closing: "",
              coverStyle,
              chapters: [],
              removedPhotos: [],
              customized: false,
              updatedAt: new Date().toISOString(),
            };
        return {
          ...prev,
          bookDrafts: [
            next,
            ...prev.bookDrafts.filter((item) => item.volume !== volume),
          ],
        };
      });
    },
    [commit],
  );

  const clearBookDraft = useCallback(
    async (volume: number) => {
      await commit((prev) => ({
        ...prev,
        bookDrafts: prev.bookDrafts.filter((item) => item.volume !== volume),
      }));
    },
    [commit],
  );

  const resetStory = useCallback(async () => {
    await commit(() => emptyState());
  }, [commit]);

  const value = useMemo(
    () => ({
      ready,
      state,
      startStory,
      updateCoupleProfile,
      addMemory,
      updateMemory,
      deleteMemory,
      saveBookDraft,
      setBookCoverStyle,
      clearBookDraft,
      resetStory,
    }),
    [
      ready,
      state,
      startStory,
      updateCoupleProfile,
      addMemory,
      updateMemory,
      deleteMemory,
      saveBookDraft,
      setBookCoverStyle,
      clearBookDraft,
      resetStory,
    ],
  );

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory는 StoryProvider 안에서만 사용할 수 있어요.");
  }
  return context;
}
