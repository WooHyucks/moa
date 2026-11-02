import {
  formatKoreanDate,
  formatMonthHeading,
  getVolumeWindows,
  type VolumeWindow,
} from "@/lib/dates";
import { emotionLabel } from "@/lib/emotions";
import { displayNames } from "@/lib/partners";
import type {
  Book,
  BookChapter,
  BookDraft,
  CoverStyle,
  Memory,
  StoryState,
} from "@/lib/types";

function paragraph(memory: Memory) {
  const lines = [formatMonthDay(memory.date)];
  const emotion = emotionLabel(memory.emotion);
  if (emotion) lines.push(`감정 · ${emotion}`);
  if (memory.content?.trim()) {
    lines.push(memory.content.trim());
  } else if (memory.photos.length > 0) {
    lines.push("이 날은 사진으로 남아 있어요.");
  }
  return lines.join("\n");
}

function formatMonthDay(dateKey: string) {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}

function chaptersFromMemories(memories: Memory[]): BookChapter[] {
  const groups = new Map<string, Memory[]>();
  for (const memory of memories) {
    const key = memory.date.slice(0, 7);
    const list = groups.get(key) ?? [];
    list.push(memory);
    groups.set(key, list);
  }

  return [...groups.entries()].map(([key, items]) => ({
    id: key,
    title: formatMonthHeading(key),
    body: items.map(paragraph).join("\n\n"),
    memoryIds: items.map((memory) => memory.id),
    photos: items.flatMap((memory) =>
      memory.photos.map((src, index) => ({
        memoryId: memory.id,
        index,
        src,
      })),
    ),
  }));
}

function applyDraft(chapters: BookChapter[], draft?: BookDraft) {
  if (!draft?.customized) return chapters;
  const removed = new Set(
    draft.removedPhotos.map((photo) => `${photo.memoryId}:${photo.index}`),
  );

  return chapters.map((chapter) => {
    const edited = draft.chapters.find((item) => item.id === chapter.id);
    return {
      ...chapter,
      title: edited?.title?.trim() || chapter.title,
      body: edited?.body ?? chapter.body,
      photos: chapter.photos.filter(
        (photo) => !removed.has(`${photo.memoryId}:${photo.index}`),
      ),
    };
  });
}

function defaultClosing(window: VolumeWindow, count: number) {
  if (count === 0) {
    return `${window.label}까지 남긴 기록이 없어요. 없는 일은 적지 않고, 비어 있는 채로 두었어요.`;
  }
  return `${window.label}까지 남긴 ${count}개의 기록이 이 권의 전부예요.`;
}

function defaultCoverStyle(photos: string[]): CoverStyle {
  if (photos.length >= 2) return "collage";
  if (photos.length === 1) return "full";
  return "editorial";
}

export function openingText(book: Book, names: string) {
  if (book.memoryCount === 0) {
    return `${names}의 ${book.label}. 이 기간에 남긴 기록은 없어요.`;
  }
  return `${formatKoreanDate(book.startDate)}부터 ${formatKoreanDate(book.endDate)}까지, ${names}의 기록 ${book.memoryCount}개를 시간 순서대로 엮었어요.`;
}

export function memoriesForWindow(memories: Memory[], window: VolumeWindow) {
  return memories
    .filter((memory) => memory.date >= window.startDate && memory.date <= window.endDate)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt),
    );
}

export function photosForWindow(memories: Memory[], window: VolumeWindow) {
  const inside = memoriesForWindow(memories, window).flatMap((memory) => memory.photos);
  if (inside.length > 0) return inside.slice(0, 6);
  return memories
    .slice()
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
    )
    .flatMap((memory) => memory.photos)
    .slice(0, 6);
}

/**
 * Chapters are assembled only from stored memories.
 * Dates, emotions, text, and photos are copied. No episode is invented.
 */
export function buildBook(
  state: StoryState,
  volumeNumber: number,
  now = new Date(),
): Book | null {
  if (!state.couple) return null;
  const window = getVolumeWindows(state.couple.startDate, now).find(
    (item) => item.volume === volumeNumber,
  );
  if (!window) return null;

  const memories = memoriesForWindow(state.memories, window);
  const draft = state.bookDrafts.find((item) => item.volume === volumeNumber);
  const generated = chaptersFromMemories(memories);
  const chapters = applyDraft(generated, draft);
  const chapterPhotos = chapters.flatMap((chapter) =>
    chapter.photos.map((photo) => photo.src),
  );
  const coverPhotos =
    chapterPhotos.length > 0
      ? chapterPhotos.slice(0, 6)
      : photosForWindow(state.memories, window);

  return {
    id: `${state.couple.id}-vol-${window.volume}`,
    coupleId: state.couple.id,
    volume: window.volume,
    anniversaryDate: window.anniversaryDate,
    status: window.status,
    title: draft?.customized && draft.title.trim() ? draft.title.trim() : window.title,
    label: window.label,
    startDate: window.startDate,
    endDate: window.endDate,
    coverStyle: draft?.coverStyle ?? defaultCoverStyle(coverPhotos),
    coverPhotos,
    chapters,
    closing:
      draft?.customized && draft.closing.trim()
        ? draft.closing
        : defaultClosing(window, memories.length),
    customized: Boolean(draft?.customized),
    createdAt: state.couple.createdAt,
    memoryCount: memories.length,
  };
}

export function listShelfBooks(state: StoryState, now = new Date()) {
  if (!state.couple) return [];
  return getVolumeWindows(state.couple.startDate, now);
}

export function coupleLine(state: StoryState) {
  return displayNames(state.partners);
}
