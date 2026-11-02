import type { EmotionId } from "@/lib/types";

export const EMOTIONS: { id: EmotionId; label: string; mark: string }[] = [
  { id: "happy", label: "행복", mark: "☺️" },
  { id: "flutter", label: "설렘", mark: "💓" },
  { id: "ordinary", label: "평범", mark: "🍃" },
  { id: "hurt", label: "속상함", mark: "🌧️" },
  { id: "conflict", label: "다툼", mark: "🌬️" },
];

export function emotionLabel(id?: EmotionId) {
  return EMOTIONS.find((emotion) => emotion.id === id)?.label;
}

export function emotionMark(id?: EmotionId) {
  return EMOTIONS.find((emotion) => emotion.id === id)?.mark;
}

export function isEmotionId(value: string): value is EmotionId {
  return EMOTIONS.some((emotion) => emotion.id === value);
}
