export type EmotionId = "happy" | "flutter" | "ordinary" | "hurt" | "conflict";

export type BookStatus = "collecting" | "ready";

export type CoverStyle = "full" | "editorial" | "collage";

export interface Couple {
  id: string;
  startDate: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  coupleId: string;
  name: string;
  nickname?: string;
  ageRange?: string;
  mbti?: string;
  isSelf: boolean;
}

export interface Memory {
  id: string;
  coupleId: string;
  authorId: string;
  date: string;
  emotion?: EmotionId;
  content?: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BookPhoto {
  memoryId: string;
  index: number;
  src: string;
}

export interface BookChapter {
  id: string;
  title: string;
  body: string;
  memoryIds: string[];
  photos: BookPhoto[];
}

export interface BookDraft {
  volume: number;
  title: string;
  closing: string;
  coverStyle?: CoverStyle;
  chapters: Array<Pick<BookChapter, "id" | "title" | "body">>;
  removedPhotos: Array<{ memoryId: string; index: number }>;
  customized: boolean;
  updatedAt: string;
}

export interface Book {
  id: string;
  coupleId: string;
  volume: number;
  anniversaryDate: string;
  status: BookStatus;
  title: string;
  label: string;
  startDate: string;
  endDate: string;
  coverStyle: CoverStyle;
  coverPhotos: string[];
  chapters: BookChapter[];
  closing: string;
  customized: boolean;
  createdAt: string;
  memoryCount: number;
}

export interface StoryState {
  version: 1;
  couple: Couple | null;
  partners: Partner[];
  memories: Memory[];
  bookDrafts: BookDraft[];
}

export interface MemoryInput {
  date: string;
  emotion?: EmotionId;
  content?: string;
  photos: string[];
}

export interface OnboardingInput {
  myName: string;
  partnerName: string;
  startDate: string;
  myNickname?: string;
  partnerNickname?: string;
  myAgeRange?: string;
  partnerAgeRange?: string;
  myMbti?: string;
  partnerMbti?: string;
}
